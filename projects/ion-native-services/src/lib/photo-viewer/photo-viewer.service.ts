import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Injectable({
    providedIn: 'root'
})
export class NativePhotoViewerService {

    constructor(
        private platform: Platform,
        private photoViewer: PhotoViewer
    ) { }

    public async view(image: string) {
        if (this.platform.is('android') || this.platform.is('ios')) {
            if (!!image) {
                this.photoViewer.show(image, "", { share: false });
            }
        }
    }

}
