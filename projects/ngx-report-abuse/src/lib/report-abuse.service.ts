import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ReportAbuseService {

    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    constructor(
        private store: AngularFirestore
    ) { }

    async report(report: any) {
        let id = this.store.createId();
        report.id = id;
        return this.store.collection('reportAbuse').doc(id).set(Object.assign({}, report), { merge: true });
    }
}