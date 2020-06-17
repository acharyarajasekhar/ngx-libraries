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
import { Subject } from 'rxjs';
const fcm = new FCM();

@Injectable({
    providedIn: 'root'
})
export class NativeFirebasePushNotificationService {

    public registration: Subject<any> = new Subject<any>();
    public registrationError: Subject<any> = new Subject<any>();
    public pushNotificationActionPerformed: Subject<any> = new Subject<any>();
    public pushNotificationReceived: Subject<any> = new Subject<any>();

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
                    this.registration.next(token);
                }
            );

            PushNotifications.addListener('registrationError',
                (error: any) => {
                    this.registrationError.next(error);
                }
            );

            PushNotifications.addListener('pushNotificationReceived',
                (notification: PushNotification) => {
                    this.pushNotificationReceived.next(notification);
                }
            );

            PushNotifications.addListener('pushNotificationActionPerformed',
                (notification: PushNotificationActionPerformed) => {
                    this.pushNotificationActionPerformed.next(notification);
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
