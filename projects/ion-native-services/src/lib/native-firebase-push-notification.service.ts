import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import {
    Plugins,
    PushNotification,
    PushNotificationToken,
    PushNotificationActionPerformed
} from '@capacitor/core';

const { PushNotifications } = Plugins;

import { FCM } from "capacitor-fcm";
const fcm = new FCM();

@Injectable({
    providedIn: 'root'
})
export class NativeFirebasePushNotificationService {

    constructor(
        private platform: Platform
    ) { }

    public init() {
        if (this.platform.is('android') || this.platform.is('ios')) {
            PushNotifications.requestPermission().then(result => {
                if (result.granted) {
                    PushNotifications.register();
                } else {
                    console.log("Push Notifications - Permission Denied");
                }
            });

            PushNotifications.addListener('registration',
                (token: PushNotificationToken) => {
                    console.log('Push registration success, token: ' + token.value);
                }
            );

            PushNotifications.addListener('registrationError',
                (error: any) => {
                    console.log('Error on registration: ' + JSON.stringify(error));
                }
            );

            PushNotifications.addListener('pushNotificationReceived',
                (notification: PushNotification) => {
                    console.log('Push received: ' + JSON.stringify(notification));
                }
            );

            PushNotifications.addListener('pushNotificationActionPerformed',
                (notification: PushNotificationActionPerformed) => {
                    console.log('Push action performed: ' + JSON.stringify(notification));
                }
            );
        }
    }

    public subscribeToTopic(topicName: string) {
        if (this.platform.is('android') || this.platform.is('ios')) {
            return fcm.subscribeTo({ topic: topicName });
        }
    }

    public unsubscribeFromTopic(topicName: string) {
        if (this.platform.is('android') || this.platform.is('ios')) {
            return fcm.unsubscribeFrom({ topic: topicName });
        }
    }

}
