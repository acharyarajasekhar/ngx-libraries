import { Injectable } from '@angular/core';
import { NetworkAlertComponent } from './network-alert.component';
import { DynamicDomInjectorService } from '@acharyarajasekhar/dynamic-dom-injector';

@Injectable({
  providedIn: 'root'
})
export class NetworkAlertService {

  private compRef: any;
    private options: any = {
        icon: 'cloud-offline-outline',
        bdColor: "rgba(0, 0, 0, 0.5)",
        bgColor: '#fff',
        color: '#000',
        message: "You are offline",
    };

    constructor(private domSvc: DynamicDomInjectorService) { }

    initialize(options?) {
        if (options) this.options = { ...this.options, ...options };
    }

    show() {
        if (!this.compRef) {
            this.compRef = this.domSvc.attach(NetworkAlertComponent, this.options);
        }
    }

    hide() {
        if (this.compRef) {
            this.domSvc.detach(this.compRef);
            this.compRef = undefined;
        }
    }
    
}
