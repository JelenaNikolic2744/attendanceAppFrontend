import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const jwt = this.authService.getJwt();
    
    let token = '';
    if (jwt) {
      token =  `Bearer ${jwt}`;
    }

    request = request.clone({
      setHeaders: {
        Authorization: token,
        'Content-type': 'application/json',
      },
    });
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              console.log(err.status);
              return;
            }
            this.router.navigate(['login']);
            this.authService.removeJwt();
          }
        }
      )
    );
  }

}

export const HttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
