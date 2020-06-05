import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';

declare var SMS: any;

@Injectable({
    providedIn: 'root'
})
export class NativeSMSListenerService {

    constructor(
        private platform: Platform,
        private androidPermissions: AndroidPermissions,
        private toast: ToastService
    ) { }

    public checkPermissions() {

        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
            result => this.toast.show(`Has READ_SMS permission? ${JSON.stringify(result)}`),
            err => {
                this.toast.error(err);
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS);
            }
        );

        this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.READ_SMS
        ]);

    }

    public startSMSWatch(onWatchStartCallback: any, onSMSArriveCallback: any) {
        return new Promise((resolve) => {
            this.platform.ready().then(() => {
                if (SMS) {
                    SMS.startWatch(() => {
                        document.addEventListener('onSMSArrive', async (e: any) => {
                            if (!!onSMSArriveCallback && onSMSArriveCallback instanceof Function) await onSMSArriveCallback(e)
                        });
                        onWatchStartCallback();
                        resolve();
                    }, (error: any) => {
                        this.toast.error(error);
                        resolve();
                    });
                }
                else {
                    this.toast.error('SMS plugin not found');
                    resolve();
                }
            });
        });
    }

    public stopSMSWatch() {
        return new Promise((resolve, reject) => {
            this.platform.ready().then(() => {
                if (SMS) {
                    SMS.stopWatch(() => {
                        resolve();
                    }, (error: any) => {
                        this.toast.error(error);
                        resolve();
                    });
                }
                else {
                    this.toast.error('SMS plugin not found');
                    resolve();
                }
            });
        });
    }

}