import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NetworkAlertComponent } from './network-alert.component';
import { DynamicDomInjectorModule } from '@acharyarajasekhar/dynamic-dom-injector';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NetworkAlertComponent],
  imports: [
    CommonModule,
    DynamicDomInjectorModule
  ],
  exports: [NetworkAlertComponent],
  entryComponents: [NetworkAlertComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NetworkAlertModule { }
