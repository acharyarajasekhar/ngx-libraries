import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PhotoSlidesCardComponent } from './photo-slides-card.component';
import { CommonModule } from '@angular/common';
import { NgxImagePreloaderModule } from '@acharyarajasekhar/ngx-image-preloader';

@NgModule({
  declarations: [PhotoSlidesCardComponent],
  imports: [
    CommonModule,
    NgxImagePreloaderModule
  ],
  exports: [PhotoSlidesCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PhotoSlidesCardModule { }
