import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

export type OrderByDirection = 'desc' | 'asc';

export type WhereFilterOp =
    | '<'
    | '<='
    | '=='
    | '>='
    | '>'
    | 'array-contains'
    | 'in'
    | 'array-contains-any';

export type WhereCondition = {
    fieldPath: string,
    opStr: WhereFilterOp,
    value: any
}

export interface QueryConfig {
    pathToCollection: string, //  path to collection
    fieldToSort: string, // field to orderBy
    sortOrder: OrderByDirection, // asc or desc
    limitPerBatch: number, // limit per query
    where: Array<WhereCondition>// where conditions
}

@Injectable()
export class FirestoreDataPaginationService {

    // Source data
    private _empty = new BehaviorSubject(false);
    private _done = new BehaviorSubject(false);
    private _loading = new BehaviorSubject(false);
    private _data = new BehaviorSubject([]);

    // Observable data
    data: Observable<any> = this._data.asObservable();
    empty: Observable<boolean> = this._empty.asObservable();
    done: Observable<boolean> = this._done.asObservable();
    loading: Observable<boolean> = this._loading.asObservable();

    private documents = []  // list of documents
    private listeners = []  // list of listeners
    private start: any = null    // start position of listener
    private end: any = null      // end position of listener
    private queryConfig: QueryConfig;

    constructor(private store: AngularFirestore) { }

    private reset() {
        this.documents = [];
        this._data.next(this.documents);
        this._empty.next(false);
        this._loading.next(false);
        this._done.next(false);
        this.start = null;
        this.end = null;
    }

    init(queryConfig: QueryConfig) {

        this.reset();

        this.queryConfig = queryConfig;

        this._loading.next(true);

        let ref = this.store.collection(this.queryConfig.pathToCollection).ref;

        let query = ref
            .orderBy(this.queryConfig.fieldToSort, this.queryConfig.sortOrder)
            .limit(this.queryConfig.limitPerBatch);

        if (!!this.queryConfig.where && this.queryConfig.where.length) {
            this.queryConfig.where.forEach(w => {
                query = query.where(w.fieldPath, w.opStr, w.value);
            })
        }

        // single query to get startAt snapshot
        query.get()
            .then((snapshots) => {

                if (snapshots.size === 0) {
                    this._empty.next(true);
                    this._loading.next(false);
                    this.newStart();
                    return;
                };

                // save startAt snapshot
                this.start = snapshots.docs[snapshots.docs.length - 1]

                let innerQuery = ref
                    .orderBy(this.queryConfig.fieldToSort, "asc")
                    .startAt(this.start);

                if (!!this.queryConfig.where && this.queryConfig.where.length) {
                    this.queryConfig.where.forEach(w => {
                        query = query.where(w.fieldPath, w.opStr, w.value);
                    })
                }

                // create listener using startAt snapshot (starting boundary)    
                let listener =
                    innerQuery.onSnapshot((docs) => {

                        if (docs.size < this.queryConfig.limitPerBatch) this._done.next(true);

                        // append new messages to message array
                        docs.forEach((doc) => {
                            // filter out any duplicates (from modify/delete events)         
                            this.documents = this.documents.filter(x => x.id !== doc.id)
                            this.documents.push({
                                id: doc.id,
                                ...doc.data()
                            })
                        });
                        this._data.next(this.documents);
                        this._loading.next(false);
                    })

                // add listener to list
                this.listeners.push(listener)
            })
    }

    more() {

        this._loading.next(true);

        let ref = this.store.collection(this.queryConfig.pathToCollection).ref;

        if(!this.start) {
            this._done.next(true);
            this._loading.next(false);
            return;
        }

        let query = ref
            .orderBy(this.queryConfig.fieldToSort, 'desc')
            .startAt(this.start)
            .limit(this.queryConfig.limitPerBatch + 1);

        if (!!this.queryConfig.where && this.queryConfig.where.length) {
            this.queryConfig.where.forEach(w => {
                query = query.where(w.fieldPath, w.opStr, w.value);
            })
        }

        // single query to get new startAt snapshot
        query.get()
            .then((snapshots) => {
                // previous starting boundary becomes new ending boundary
                this.end = this.start
                this.start = snapshots.docs[snapshots.docs.length - 1];

                let innerQuery = ref
                    .orderBy(this.queryConfig.fieldToSort, "asc")
                    .startAt(this.start)
                    .endBefore(this.end);

                if (!!this.queryConfig.where && this.queryConfig.where.length) {
                    this.queryConfig.where.forEach(w => {
                        innerQuery = innerQuery.where(w.fieldPath, w.opStr, w.value);
                    })
                }

                // create another listener using new boundaries     
                let listener =
                    innerQuery.onSnapshot((docs) => {

                        if (docs.size < this.queryConfig.limitPerBatch) this._done.next(true);

                        docs.forEach((doc) => {
                            this.documents = this.documents.filter(x => x.id !== doc.id)
                            this.documents.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        })
                        this._data.next(this.documents);
                        this._loading.next(false);
                    })

                // add listener to list
                this.listeners.push(listener)
            })
    }

    newStart() {
        let ref = this.store.collection(this.queryConfig.pathToCollection).ref;

        let query = ref
            .orderBy(this.queryConfig.fieldToSort, "asc");

        if (!!this.queryConfig.where && this.queryConfig.where.length) {
            this.queryConfig.where.forEach(w => {
                query = query.where(w.fieldPath, w.opStr, w.value);
            })
        }

        // create listener using startAt snapshot (starting boundary)    
        let listener =
            query.onSnapshot((docs) => {

                this._loading.next(true);
                if (docs.size > 0) this._empty.next(false);

                // append new messages to message array
                docs.forEach((doc) => {

                    // filter out any duplicates (from modify/delete events)         
                    this.documents = this.documents.filter(x => x.id !== doc.id)
                    this.documents.push({
                        id: doc.id,
                        ...doc.data()
                    })
                    if (!this.start) {
                        this.start = doc;
                        this._done.next(true);
                    }
                });
                this._data.next(this.documents);
                this._loading.next(false);
            })

        // add listener to list
        this.listeners.push(listener)
    }

    onRemove(docId) {
        this._loading.next(true);
        this.documents = this.documents.filter(x => x.id !== docId);
        this._data.next(this.documents);
        if (this.documents.length === 0) {
            this._empty.next(true);
            this._done.next(false);
        }
        this._loading.next(false);
    }

    // call to detach all listeners
    detachListeners() {
        this.listeners.forEach(listener => listener())
    }

}
