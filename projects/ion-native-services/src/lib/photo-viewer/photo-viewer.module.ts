import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoViewerDirective } from './photo-viewer.directive';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@NgModule({
  declarations: [PhotoViewerDirective],
  imports: [
    CommonModule
  ],
  exports: [PhotoViewerDirective],
  providers: [PhotoViewer]
})
export class PhotoViewerModule { }
