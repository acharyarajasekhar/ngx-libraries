import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NgxGenericFormService {

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  constructor(
    private store: AngularFirestore
  ) { }

  async report(collection: string, doc: any) {
    let id = this.store.createId();
    doc.id = id;
    return this.store.collection(collection).doc(id).set(Object.assign({}, doc), { merge: true });
  }
}
