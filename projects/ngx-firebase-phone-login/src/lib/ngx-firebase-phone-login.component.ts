import { Component, OnInit, ViewChildren, NgZone } from '@angular/core';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { NativeFirebaseAuthService } from '@acharyarajasekhar/ion-native-services';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';
import * as firebase from 'firebase/app';

@Component({
  selector: 'ngx-firebase-phone-login',
  templateUrl: 'ngx-firebase-phone-login.component.html',
  styleUrls: ['ngx-firebase-phone-login.component.css']
})
export class NgxFirebasePhoneLoginComponent implements OnInit {

  windowRef: any = window;

  @ViewChildren('captchaDiv') public reCaptchaDivRef: any;

  phoneNumber: string;
  verificationCode: string;

  public smsWatch: boolean = false;
  isMobile: boolean = false;

  constructor(
    private busy: BusyIndicatorService,
    private router: Router,
    private toast: ToastService,
    private zone: NgZone,
    private platform: Platform,
    private nativeFireBaseAuth: NativeFirebaseAuthService
  ) {
    if (this.platform.is('android') || this.platform.is('ios')) this.isMobile = true;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.phoneNumber = null;
      this.verificationCode = null;
      this.windowRef.confirmationResult = null;
    });

    if (!this.isMobile && !!this.reCaptchaDivRef && !!this.reCaptchaDivRef.first) {
      setTimeout(() => {
        let tempOpt = { size: 'invisible', badge: 'inline', callback: (resp) => { }, 'expired-callback': (resp) => { console.log(resp); } }
        this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(this.reCaptchaDivRef.first.nativeElement, tempOpt);
        this.windowRef.recaptchaVerifier.render();
      });
    }
  }

  sendLoginCode() {

    if (!!!this.phoneNumber) {
      this.toast.error({ message: "Please enter valid phone number" });
      return;
    }

    if (this.isMobile) {
      this.loginWithPhoneNumberByApp();
    }
    else {
      this.loginWithPhoneNumberByWeb();
    }
  }

  private loginWithPhoneNumberByApp() {
    this.busy.show();
    const num = "+91" + this.phoneNumber.toString();

    this.nativeFireBaseAuth.signInPhoneOnCodeSent().subscribe(verificationId => {
      this.zone.run(() => {
        this.smsWatch = true;
        this.windowRef.confirmationResult = verificationId;
      });
      this.busy.hide();
      this.toast.show("Verification code is sent to your mobile number");
    })

    if (this.platform.is('android')) {
      this.nativeFireBaseAuth.signInPhoneOnCodeReceived().subscribe((event: { verificationId: string, verificationCode: string }) => {        
        this.verificationCode = event.verificationCode;
      })
    }

    this.nativeFireBaseAuth.verifyPhoneNumber(num).subscribe(user => {
      console.log(user);
      this.windowRef.confirmationResult = null;
      this.router.navigate(['/home']);
      this.toast.show("Login successfull...");
    })

  }

  private loginWithPhoneNumberByWeb() {
    this.busy.show();
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = "+91" + this.phoneNumber.toString();
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        this.zone.run(() => {
          this.windowRef.confirmationResult = result;
        });
        this.busy.hide();
        this.toast.show("Verification code is sent to your mobile number");
      })
      .catch(error => {
        this.busy.hide();
        this.windowRef.confirmationResult = null;
        this.toast.error(error);
      });
  }

  verifyLoginCode() {

    if (!!!this.verificationCode) {
      this.toast.error({ message: "Please enter verification code" });
      return;
    }

    if (this.isMobile) {
      this.verifyLoginOtpByApp();
    }
    else {
      this.verifyLoginOtpByWeb();
    }

  }

  private verifyLoginOtpByApp() {
    this.busy.show();
    this.nativeFireBaseAuth.validateOtp(this.windowRef.confirmationResult, this.verificationCode.toString())
      .then(result => {
        this.busy.hide();
        this.windowRef.confirmationResult = null;
        this.phoneNumber = null;
        this.verificationCode = null;
        this.router.navigate(['/home']);
        this.toast.show("Login successfull...");
      })
      .catch(error => {
        this.busy.hide();
        this.toast.error(error);
      });
  }

  private verifyLoginOtpByWeb() {
    this.busy.show();
    this.windowRef.confirmationResult
      .confirm(this.verificationCode.toString())
      .then(result => {
        this.busy.hide();
        this.windowRef.confirmationResult = null;
        this.router.navigate(['/home']);
        this.toast.show("Login successfull...");
      })
      .catch(error => {
        this.busy.hide();
        this.toast.error(error);
      });
  }

}
