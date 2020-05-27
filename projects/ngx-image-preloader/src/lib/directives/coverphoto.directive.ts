import { Directive, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[coverphoto]',
    host: {
        '[attr.src]': 'finalImage'
    }
})
export class CoverPhotoPreloader implements OnInit {

    @Input('coverphoto') targetSource: string;
    @Input() defaultImage: string = 'assets/defaults/nocoverphoto.png';
    @Input() fallbackImage: string = 'assets/defaults/nocoverphoto.png';

    downloadingImage: any;
    finalImage: any;

    ngOnInit() {

        this.finalImage = this.defaultImage;

        if (!!this.targetSource) {

            this.downloadingImage = new Image();
            this.downloadingImage.onerror = () => {
                this.finalImage = this.fallbackImage;
            }
            this.downloadingImage.onload = () => {
                this.finalImage = this.targetSource;
            }

            this.downloadingImage.src = this.targetSource;
        }
        else {
            this.finalImage = this.fallbackImage;
        }
    }

}