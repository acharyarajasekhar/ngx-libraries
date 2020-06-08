import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlsService } from '@acharyarajasekhar/dynamic-forms';
import { ModalController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';

@Component({
  templateUrl: './ngx-generic-form.component.html',
  styleUrls: ['./ngx-generic-form.component.scss'],
})
export class NgxGenericFormComponent implements OnInit {

  @ViewChild('dynamicForm', { static: true }) dynamicForm: any;

  controls: Array<any>;
  form: FormGroup;
  submitted: any;
  formConfig: any;

  pageTitle: string = 'Generic Form';
  headerColor: string = 'primary';
  contentColor: string = 'light';

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
    if (this.form.invalid) {
      this.dynamicForm.showErrors();
    }
    else {
      this.modalController.dismiss(this.submitted, 'ok');
    }
  }

}
