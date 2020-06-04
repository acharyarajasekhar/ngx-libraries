import { Directive, HostListener, Input } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Platform } from '@ionic/angular';

@Directive({
    selector: '[zoomable]'
})
export class PhotoViewerDirective {

    @Input('zoomable') imageSource: string;

    constructor(
        private photoViewer: PhotoViewer,
        private platform: Platform
    ) { }

    ngOnInit() { }

    @HostListener('click', ['$event'])
    async clickEvent(event) {
        if (this.platform.is('android') || this.platform.is('ios')) {
            event.preventDefault();
            event.stopPropagation();
            if (!!this.imageSource) {
                this.photoViewer.show(this.imageSource, "", { share: false });
            }
        }
    }

}
