import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Injectable({
    providedIn: 'root'
})
export class NativeAppVersionService {

    appName: string;
    appPackageName: string;
    appVersionCode: any;
    appVersionNumber: string;

    constructor(
        private appVersion: AppVersion
    ) { }

    public async init() {
        this.appName = await this.appVersion.getAppName();
        this.appPackageName = await this.appVersion.getPackageName();
        this.appVersionCode = await this.appVersion.getVersionCode();
        this.appVersionNumber = await this.appVersion.getVersionNumber();
    }

}
