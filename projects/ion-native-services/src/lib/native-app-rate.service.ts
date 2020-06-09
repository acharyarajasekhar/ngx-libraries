import { Injectable } from '@angular/core';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { NativeAppVersionService } from './native-app-version.service';

@Injectable({
    providedIn: 'root'
})
export class NativeAppRateService {

    constructor(
        private appRate: AppRate,
        private appVersion: NativeAppVersionService
    ) { }

    public init() {

        this.appRate.preferences = {
            storeAppURL: {
                android: `market://details?id=${this.appVersion.appPackageName}`,
            },
            simpleMode: true,
            promptAgainForEachNewVersion: true,
            displayAppName: `${this.appVersion.appName}`,
            usesUntilPrompt: 3,
            customLocale: {
                title: 'Do you enjoy %@?',
                message: 'If you enjoy using %@, would you mind taking a moment to rate it? Thank you so much!',
                cancelButtonLabel: 'No, Thanks',
                laterButtonLabel: 'Remind Me Later',
                rateButtonLabel: 'Rate It Now'
            },
            callbacks: {
                onRateDialogShow: function (callback) {
                    console.log('rate dialog shown!');
                },
                onButtonClicked: function (buttonIndex) {
                    console.log('Selected index: -> ' + buttonIndex);
                }
            }
        }

    }

    public async promptNow() {
        this.appRate.promptForRating(true);
    }

    public async navigateToAppStore() {
        this.appRate.navigateToAppStore();
    }

}