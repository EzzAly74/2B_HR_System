import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
   
    const token = localStorage.getItem('userToken') ;
    const router = inject(Router);
    if (token) {
    const decodedToken = jwtDecode(token)  ;
    const curDate = new Date(); // Get current date and time
    const expDate: Date = new Date(decodedToken.exp * 1000);  // Convert token expiration to Date
   
    console.log('Expiration Date:', expDate);
    console.log('Current Date:', curDate);
    
    // Check if the token has expired
    if (expDate < curDate) {
        console.log('Token has expired.');
        localStorage.removeItem('userToken');
        router.navigate(['/auth/login'])
    } 
}


    const req = request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });

    return next(req).pipe(
    );
};
