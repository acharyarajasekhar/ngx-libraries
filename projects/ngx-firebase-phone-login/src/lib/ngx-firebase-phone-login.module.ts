import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxFirebasePhoneLoginComponent } from './ngx-firebase-phone-login.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NgxFirebasePhoneLoginComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [NgxFirebasePhoneLoginComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NgxFirebasePhoneLoginModule { }
