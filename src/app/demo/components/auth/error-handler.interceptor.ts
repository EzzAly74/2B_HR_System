import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  private isMessageActive = false;

  constructor(
    private messageService: MessageService,
    private translate: TranslateService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.success === false) {
            const message = event.body.message || this.translate.instant('An Error Occurred');

            this.displayErrorMessage(message); // Attempt to display error message
          }
        }
      }),
      catchError((error) => {
        const defaultMessage = this.translate.instant('An unexpected error occurred');
        
        this.displayErrorMessage(defaultMessage); // Attempt to display default error message

        return throwError(error);
      })
    );
  }

  // Function to display error message only if no message is currently active
  private displayErrorMessage(message: string): void {
    // Check if a message is already active
    if (!this.isMessageActive) {
      this.isMessageActive = true; // Mark that a message is being displayed

      // Show the message using PrimeNG messageService
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('Error'),
        detail: message,
        life: 3000 // Show for 3 seconds
      });

      // After 3 seconds, reset the flag to allow a new message to be displayed
      setTimeout(() => {
        this.isMessageActive = false;
      }, 3000); // Wait for the message life to finish (3 seconds)
    }
    // If a message is already active, do nothing until the current one finishes
  }
}
