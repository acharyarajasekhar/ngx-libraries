import { Directive, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';

@Directive({
    selector: '[avatar]',
    host: {
        '[attr.src]': 'finalImage'
    }
})
export class AvatarPreloader implements OnInit, OnChanges {

    @Input('avatar') targetSource: string;
    @Input() defaultImage: string = 'assets/defaults/avatar.svg';

    downloadingImage: any;
    finalImage: any;

    ngOnChanges(changes: SimpleChanges) {
        this.setAvatar();
    }

    ngOnInit() {
        this.setAvatar();
    }


    private setAvatar() {
        this.finalImage = this.defaultImage;
        if (!!this.targetSource) {
            this.downloadingImage = new Image();
            this.downloadingImage.onerror = () => {
                this.finalImage = this.defaultImage;
            };
            this.downloadingImage.onload = () => {
                this.finalImage = this.targetSource;
            };
            this.downloadingImage.src = this.targetSource;
        }
    }
}