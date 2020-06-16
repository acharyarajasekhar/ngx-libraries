import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { cfaSignIn, cfaSignInPhoneOnCodeSent, cfaSignInPhoneOnCodeReceived } from 'capacitor-firebase-auth';

@Injectable({
    providedIn: 'root'
})
export class NativeFirebaseAuthService {

    constructor() { }

    verifyPhoneNumber(phoneNumber: string) {
        return cfaSignIn('phone', { phone: phoneNumber });
    }

    signInPhoneOnCodeSent() {
        return cfaSignInPhoneOnCodeSent();
    }

    signInPhoneOnCodeReceived() {
        return cfaSignInPhoneOnCodeReceived();
    }

    validateOtp(verificationId: string, verificationCode: string) {
        let credentials = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
        return firebase.auth().signInWithCredential(credentials);
    }

}
