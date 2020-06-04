import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    private toast: any;

    constructor(
        private toastController: ToastController) { }

    async show(message: string, duration: number = 2000) {
        this.toast = await this.toastController.create({
            message: message,
            duration: duration,
            mode: 'ios',
            color: 'dark'
        });
        await this.toast.present();
    }

    async error(error: any) {

        let message: any = '';

        if (typeof error === 'string' || error instanceof String) { message = error; }
        else if (!!error.message) { message = error.message; }
        else { message = JSON.stringify(error); }

        const toast = await this.toastController.create({
            header: 'ERROR',
            message: message,
            position: 'bottom',
            mode: 'ios',
            color: 'danger',
            buttons: [{
                text: 'Ok',
                role: 'cancel',
                handler: () => { }
            }]
        });
        toast.present();

    }

}
