import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { cfaSignIn, cfaSignInPhoneOnCodeSent, cfaSignInPhoneOnCodeReceived, cfaSignOut } from 'capacitor-firebase-auth';

@Injectable({
    providedIn: 'root'
})
export class NativeFirebaseAuthService {

    constructor() { }

    signInWithPhone(phoneNumber: string) {
        return cfaSignIn('phone', { phone: phoneNumber });
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
