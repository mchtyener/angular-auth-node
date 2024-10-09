import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { errorSweetAlert } from '../data/sweet-alerts';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      errorSweetAlert(error.error.message)

      if (error.status === 400) {
        //status durumuna göre hata bastırılabiliri.
      }
      return throwError(() => new Error(error.error.message));
    })
  );
};
