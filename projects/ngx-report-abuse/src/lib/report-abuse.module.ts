import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportAbuseComponent } from './report-abuse.component';
import { DynamicFormsModule } from '@acharyarajasekhar/dynamic-forms';

@NgModule({
  declarations: [ReportAbuseComponent],
  imports: [
    CommonModule,
    DynamicFormsModule
  ],
  exports: [ReportAbuseComponent],
  entryComponents: [ReportAbuseComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportAbuseModule { }
