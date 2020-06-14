import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import * as firebase from 'firebase/app';

@Injectable({
    providedIn: 'root'
})
export class NativeFirebaseAuthService {

    constructor(
        private firebaseAuthentication: FirebaseAuthentication
    ) { }

    verifyPhoneNumber(phoneNumber, timeout) {
        return this.firebaseAuthentication.verifyPhoneNumber(phoneNumber, timeout);
    }

    validateOtp(verificationId, verificationCode) {
        let credentials = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
        return firebase.auth().signInWithCredential(credentials);
    }

    verifyEmailAndPassword(email: string, password: string) {
        let credentials = firebase.auth.EmailAuthProvider.credential(email, password);
        return firebase.auth().signInWithCredential(credentials);
    }

}
