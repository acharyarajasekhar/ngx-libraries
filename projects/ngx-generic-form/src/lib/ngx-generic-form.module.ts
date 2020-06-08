import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxGenericFormComponent } from './ngx-generic-form.component';
import { CommonModule } from '@angular/common';
import { DynamicFormsModule } from '@acharyarajasekhar/dynamic-forms';

@NgModule({
  declarations: [NgxGenericFormComponent],
  imports: [
    CommonModule,
    DynamicFormsModule
  ],
  entryComponents: [NgxGenericFormComponent],
  exports: [NgxGenericFormComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NgxGenericFormModule { }
