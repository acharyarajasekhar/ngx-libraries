import { Component, OnInit, Input } from '@angular/core';
import { NativePhotoViewerService } from '@acharyarajasekhar/ion-native-services';

@Component({
  selector: 'photo-slides-card',
  templateUrl: './photo-slides-card.component.html',
  styleUrls: ['./photo-slides-card.component.scss'],
})
export class PhotoSlidesCardComponent implements OnInit {

  @Input() slides: Array<string>;
  @Input() height: any = "250px";
  @Input() defaultPhoto: string = "assets/defaults/nocoverphoto.png";
  @Input() loadingPhoto: string = "assets/defaults/loading.gif";
  @Input() fallbackPhoto: string = "assets/imgs/defaults/nocoverphoto.png";
  @Input() showPager: boolean = true;
  @Input() isRounded: boolean = false;
  @Input() isZoomable: boolean = true;

  options: any;

  constructor(private nativePhotoViewerService: NativePhotoViewerService) { }

  ngOnInit() {
    this.options = {
      autoplay: {
        delay: 5000,
      }
    }
  }

  async zoomThis(slide) {
    if (this.isZoomable === true) {
      await this.nativePhotoViewerService.view(slide);
    }
  }

}
