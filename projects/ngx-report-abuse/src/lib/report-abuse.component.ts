import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlsService } from '@acharyarajasekhar/dynamic-forms';
import { ModalController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';

@Component({
  templateUrl: './report-abuse.component.html',
  styleUrls: ['./report-abuse.component.scss'],
})
export class ReportAbuseComponent implements OnInit {

  @ViewChild('dynamicForm', { static: true }) dynamicForm: any;

  controls: Array<any>;
  form: FormGroup;
  submitted: any;
  formConfig: any;

  pageTitle: string = 'Report This';
  payLoad: any;

  constructor(
    private controlSvc: ControlsService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.initDynamicFormControls();
    this.initFormGroup();
  }

  private initDynamicFormControls() {
    if (!!this.formConfig) {
      this.controls = this.controlSvc.getControls(this.formConfig.controls);
    }
  }

  private initFormGroup() {
    this.form = new FormGroup({});
    this.form.valueChanges.subscribe(val => { this.submitted = val; });
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onSave() {
    console.log(this.submitted);
    if (this.form.invalid) {
      this.dynamicForm.showErrors();
    }
    else {
      let data = {
        subject: this.payLoad,
        reportedInfo: this.submitted
      }
      this.modalController.dismiss(data, 'ok');
    }
  }

}
