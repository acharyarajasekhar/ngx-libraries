import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, combineLatest } from 'rxjs';
import { UploadProgressIndicatorService } from '@acharyarajasekhar/upload-progress-indicator';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FireStorageUploadService {

    constructor(
        private storage: AngularFireStorage,
        private uploadProgress: UploadProgressIndicatorService
    ) { }

    uploadSingle(filePayLoad: any, filePath: string, message: string = "Uploading...") {

        return new Promise((res, rej) => {

            this.uploadProgress.show();

            const storageRef = this.storage.ref(filePath);
            let uploadTask = storageRef.putString(filePayLoad, 'data_url');
            let subscriptionHandle = uploadTask.percentageChanges().subscribe(p => {
                this.uploadProgress.progress({
                    message: message,
                    progress: Math.round(p)
                })
            })

            uploadTask.then(async () => {
                let downloadURL = await storageRef.getDownloadURL().toPromise();
                subscriptionHandle.unsubscribe();
                this.uploadProgress.hide();
                res(downloadURL);
            }).catch(err => {
                subscriptionHandle.unsubscribe();
                this.uploadProgress.hide();
                rej(err);
            })

        });

    }

    uploadMultiple(filePayLoads: Array<any>, filePathPrefix: string, message: string = "Uploading...") {

        return new Promise((res, rej) => {

            this.uploadProgress.show();
            const allPercentage: Observable<number>[] = [];
            const allUploadTasks = [];

            _.forEach(filePayLoads, (filePayLoad, indx) => {

                const filePath = `${filePathPrefix}_${indx}.jpg`;
                const storageRef = this.storage.ref(filePath);
                let uploadTask = storageRef.putString(filePayLoad, 'data_url');

                const _percentage$ = uploadTask.percentageChanges();
                allPercentage.push(_percentage$);

                let uploadTaskPromise = new Promise((res1, rej1) => {
                    uploadTask.then(async () => {
                        let downloadURL = await storageRef.getDownloadURL().toPromise();
                        res1(downloadURL);
                    }).catch(err => rej1(err))
                });

                allUploadTasks.push(uploadTaskPromise);
            })

            let subscriptionHandle = combineLatest(allPercentage)
                .pipe(
                    map((percentages) => {
                        let result = 0;
                        for (const percentage of percentages) {
                            result = result + percentage;
                        }
                        return result / percentages.length;
                    })).subscribe(p => {
                        this.uploadProgress.progress({
                            message: message,
                            progress: Math.round(p)
                        })
                    });

            Promise.all(allUploadTasks).then((data) => {
                subscriptionHandle.unsubscribe();
                this.uploadProgress.hide();
                res(data);
            }).catch(err => {
                subscriptionHandle.unsubscribe();
                this.uploadProgress.hide();
                rej(err)
            });

        });

    }
}
