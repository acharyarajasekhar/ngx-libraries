import { Injectable } from '@angular/core';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class NativeNavigationBarService {

    constructor(
        private platform: Platform,
        private navigationBar: NavigationBar
    ) { }

    setToAutoHide(value: boolean) {
        if (this.platform.is('android') || this.platform.is('ios')) {
            this.navigationBar.setUp(value);
        }
    }

}
