import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';

export interface SocialSharingContent {
    message?: string;
    subject?: string;
    files?: string | string[];
    url?: string;
    chooserTitle?: string;
}

@Injectable({
    providedIn: 'root'
})
export class NativeSocialSharingService {

    constructor(
        private platform: Platform,
        private socialSharing: SocialSharing
    ) { }

    public async share(content: SocialSharingContent) {
        if (this.platform.is('android') || this.platform.is('ios')) {
            await this.socialSharing.shareWithOptions(content);
        }
    }

}
