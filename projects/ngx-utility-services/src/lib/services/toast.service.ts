import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    private toast: any;

    constructor(
        private toastr: ToastrService) { }

    async info(message: string, duration: number = 2000, title: string = null) {
        this.toastr.info(message, title, {
            positionClass: 'toast-bottom-center',
            timeOut: duration
        })
    }

    async warning(message: string, duration: number = 2000, title: string = null) {
        this.toastr.warning(message, title, {
            positionClass: 'toast-bottom-center',
            timeOut: duration
        })
    }

    async success(message: string, duration: number = 2000, title: string = null) {
        this.toastr.success(message, title, {
            positionClass: 'toast-bottom-center',
            timeOut: duration
        })
    }

    async show(message: string, duration: number = 2000, title: string = null) {
        this.toastr.success(message, title, {
            positionClass: 'toast-bottom-center',
            timeOut: duration
        })
    }

    async error(error: any) {

        let message: any = '';

        if (typeof error === 'string' || error instanceof String) { message = error; }
        else if (!!error.message) { message = error.message; }
        else { message = JSON.stringify(error); }

        this.toastr.error(message, 'Error', {
            disableTimeOut: true,
            positionClass: 'toast-bottom-center',
            tapToDismiss: true,
            closeButton: true
        });

    }

}
