import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, fromEvent, of, merge } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    static instance: NetworkService | null = null;

    /** Observable to listen when Internet connection availability changes */
    onlineChanges: Observable<boolean>;

    /** Check if Internet connection is available */
    get online(): boolean {
        return isPlatformBrowser(this.platformId) ? navigator.onLine : true;
    }

    constructor(
        @Inject(PLATFORM_ID) protected platformId: string
    ) {

        /* Store instance in a static property to allow access to injected services in the RxJS static operator
         * Should be done only once */
        if (!NetworkService.instance) {

            NetworkService.instance = this;

        }

        this.onlineChanges = !isPlatformBrowser(this.platformId) ? of(true) : merge(
            fromEvent(window, 'online').pipe(mapTo(true)),
            fromEvent(window, 'offline').pipe(mapTo(false)),
        )
            .pipe(startWith(this.online));

    }

}