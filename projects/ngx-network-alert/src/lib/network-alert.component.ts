import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'na-network-alert',
  templateUrl: './network-alert.component.html',
  styleUrls: ['./network-alert.component.css']
})
export class NetworkAlertComponent implements OnInit {

  @Input() bdColor = 'rgba(0,0,0,0.3)';
  @Input() color = 'rgb(89,40,177, 1)';
  @Input() bgColor = '#fff';
  @Input() icon: string = 'cloud-offline-outline';
  @Input() message = "Critical Message";

  backButtonHandle: Subscription;

  constructor(private platform: Platform) { }

  ngOnInit() {
    this.backButtonHandle = this.platform.backButton.subscribeWithPriority(11000, () => { return; });
  }

  ngOnDestroy() {
    this.backButtonHandle.unsubscribe();
  }

}
