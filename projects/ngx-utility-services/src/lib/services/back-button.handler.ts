import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class BackButtonHandler {

    private lastTimeBackPress = 0;
    private timePeriodToExit = 2000;

    constructor(
        private toast: ToastService,
        private platform: Platform,
    ) {

        this.platform.backButton.subscribeWithPriority(10, async () => {

            this.tryExit();

        })
    }

    public init() { } // I am already ready

    private async tryExit() {
        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); // Exit app
        } else {
            this.toast.show('Press back again to exit...', this.timePeriodToExit);
            this.lastTimeBackPress = new Date().getTime();
        }
    }

}