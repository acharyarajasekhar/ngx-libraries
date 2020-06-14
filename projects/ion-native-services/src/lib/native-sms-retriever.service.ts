import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';

declare var SMS: any;

@Injectable({
    providedIn: 'root'
})
export class NativeSMSRetrieverService {

    constructor(
        private platform: Platform,
        private smsRetriever: SmsRetriever
    ) { }

    getAppHash() {
        return this.smsRetriever.getAppHash();
    }

    startWatching() {
        return this.smsRetriever.startWatching();
    }

}