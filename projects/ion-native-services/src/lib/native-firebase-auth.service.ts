import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { cfaSignInPhoneOnCodeSent, cfaSignInPhoneOnCodeReceived, cfaSignOut, cfaSignInPhone } from 'capacitor-firebase-auth';

@Injectable({
    providedIn: 'root'
})
export class NativeFirebaseAuthService {

    constructor() { }

    signInWithPhone(phoneNumber: string) {
        return cfaSignInPhone(phoneNumber, null);
    }

    onCodeSent() {
        return cfaSignInPhoneOnCodeSent();
    }

    onCodeReceived() {
        return cfaSignInPhoneOnCodeReceived();
    }

    validateCode(verificationId: string, verificationCode: string) {
        let credentials = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
        return firebase.auth().signInWithCredential(credentials);
    }

    singOut() {
        return cfaSignOut();
    }

}
