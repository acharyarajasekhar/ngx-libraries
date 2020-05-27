import { NgModule } from '@angular/core';
import { CoverPhotoPreloader } from './directives/coverphoto.directive';
import { AvatarPreloader } from './directives/avatar.directive';

@NgModule({
  declarations: [CoverPhotoPreloader, AvatarPreloader],
  imports: [
  ],
  exports: [CoverPhotoPreloader, AvatarPreloader]
})
export class NgxImagePreloaderModule { }
