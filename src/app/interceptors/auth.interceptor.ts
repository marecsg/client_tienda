import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
const authService = inject(AuthService);
  const token = authService.getToken();
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
   return next(authReq).pipe(
    tap((event) => {
      // Nos aseguramos de que sea una respuesta HTTP y no otro tipo de evento
      if (event instanceof HttpResponse) {
        // Verificamos si la respuesta tiene la cabecera 'Authorization'
        if (event.headers.has('Authorization')) {
          const newToken = event.headers.get('Authorization')?.replace('Bearer ', '');
          if (newToken) {
            console.log('Interceptor: Nuevo token recibido. Actualizando...');
            localStorage.setItem('token', newToken); 
            // Actualizamos el token en el storage
          }
        }
      }
    }),
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        console.log('Interceptor: Error 401 detectado. Cerrando sesión.');
        authService.logout();
      }
      return throwError(() => error);
    })
  );};
