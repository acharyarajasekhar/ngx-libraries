import { Component, OnInit, ViewChildren, NgZone } from '@angular/core';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { NativeFirebaseAuthService } from '@acharyarajasekhar/ion-native-services';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';
import * as firebase from 'firebase/app';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ngx-firebase-phone-login',
  templateUrl: 'ngx-firebase-phone-login.component.html',
  styleUrls: ['ngx-firebase-phone-login.component.css'],
  animations: [
    trigger('listItemState', [
      state('in',
        style({
          opacity: 1,
          height: '*',
          minHeight: '*'
        })
      ),
      transition('* => void', [
        animate('0.25s ease-out', style({
          opacity: 0,
          height: '1px',
          minHeight: '1px'
        }))
      ])
    ])
  ]
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

  ionViewWillEnter() {
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

    this.nativeFireBaseAuth.onCodeSent().pipe(take(1)).subscribe(verificationId => {
      this.zone.run(() => {
        this.smsWatch = true;
        this.windowRef.confirmationResult = verificationId;
        this.busy.hide();
        this.toast.show("OTP Sent...");
      });

    }, err => this.toast.error(err));

    if (this.platform.is('android')) {
      this.nativeFireBaseAuth.onCodeReceived().pipe(take(1)).subscribe((event: { verificationId: string, verificationCode: string }) => {
        this.zone.run(() => {
          this.windowRef.confirmationResult = event.verificationId;
          this.verificationCode = event.verificationCode;
          this.smsWatch = false;
          this.toast.show("OTP Received...");
        });
      }, err => this.toast.error(err));
    }

    let signinSub = this.nativeFireBaseAuth.signInWithPhone(num).subscribe(user => {
      if (!!user && !!user.phoneNumber) {
        this.toast.show("Login successfull...");
        signinSub.unsubscribe();
        this.router.navigate(['/home']).then(() => {
          setTimeout(() => {
            this.phoneNumber = null;
            this.verificationCode = null;
            this.windowRef.confirmationResult = null;
          }, 3000);
        });
      }
    }, err => this.toast.error(err));

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
    this.nativeFireBaseAuth.validateCode(this.windowRef.confirmationResult, this.verificationCode.toString())
      .then(result => {
        this.busy.hide();
        this.router.navigate(['/home']).then(() => {
          setTimeout(() => {
            this.phoneNumber = null;
            this.verificationCode = null;
            this.windowRef.confirmationResult = null;
          }, 3000);
        });
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
        this.router.navigate(['/home']).then(() => {
          setTimeout(() => {
            this.phoneNumber = null;
            this.verificationCode = null;
            this.windowRef.confirmationResult = null;
          }, 3000);
        });
        this.toast.show("Login successfull...");
      })
      .catch(error => {
        this.busy.hide();
        this.toast.error(error);
      });
  }

  ionViewWillLeave() {
    setTimeout(() => {
      this.phoneNumber = null;
      this.verificationCode = null;
      this.windowRef.confirmationResult = null;
    });
  }

}
