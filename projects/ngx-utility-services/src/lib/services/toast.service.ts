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
        const toast = await this.toastController.create({
            header: 'ERROR',
            message: error.message,
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
