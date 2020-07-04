import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import * as Sentry from "@sentry/browser";

@Injectable({
    providedIn: 'root'
})
export class SentryErrorHandler implements ErrorHandler {

    constructor() { }

    public init(dsn: string) {
        Sentry.init({
            dsn: dsn,
            // TryCatch has to be configured to disable XMLHttpRequest wrapping, as we are going to handle
            // http module exceptions manually in Angular's ErrorHandler and we don't want it to capture the same error twice.
            // Please note that TryCatch configuration requires at least @sentry/browser v5.16.0.
            integrations: [new Sentry.Integrations.TryCatch({
                XMLHttpRequest: false,
            })],
        });
    }

    private extractError(error) {
        // Try to unwrap zone.js error.
        // https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
        if (error && error.ngOriginalError) {
            error = error.ngOriginalError;
        }

        // We can handle messages and Error objects directly.
        if (typeof error === "string" || error instanceof Error) {
            return error;
        }

        // If it's http module error, extract as much information from it as we can.
        if (error instanceof HttpErrorResponse) {
            // The `error` property of http exception can be either an `Error` object, which we can use directly...
            if (error.error instanceof Error) {
                return error.error;
            }

            // ... or an`ErrorEvent`, which can provide us with the message but no stack...
            if (error.error instanceof ErrorEvent) {
                return error.error.message;
            }

            // ...or the request body itself, which we can use as a message instead.
            if (typeof error.error === "string") {
                return `Server returned code ${error.status} with body "${error.error}"`;
            }

            // If we don't have any detailed information, fallback to the request message itself.
            return error.message;
        }

        // Skip if there's no error, and let user decide what to do with it.
        return null;
    }

    public handleError(error) {
        let extractedError = this.extractError(error) || "Handled unknown error";

        // Capture handled exception and send it to Sentry.
        const eventId = Sentry.captureException(extractedError);

        // Optionally show user dialog to provide details on what happened.
        // Sentry.showReportDialog({ eventId });
    }

}