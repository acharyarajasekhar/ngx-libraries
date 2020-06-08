import { Injectable } from '@angular/core';
import { AppRate } from '@ionic-native/app-rate/ngx';

@Injectable({
    providedIn: 'root'
})
export class AppRateService {

    constructor(private appRate: AppRate) {
        appRate.preferences = {
            storeAppURL: {
                android: 'market://details?id=AppID',
            },
            simpleMode: true,
            promptAgainForEachNewVersion: true,
            displayAppName: "App Name",
            usesUntilPrompt: 3
        }
    }

    public init(preferences: any) {
        this.appRate.preferences = preferences;
    }

    public async promptNow() {
        this.appRate.promptForRating(true);
    }

    public async navigateToAppStore() {
        this.appRate.navigateToAppStore();
    }

}