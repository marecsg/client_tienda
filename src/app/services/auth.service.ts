import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { IUsuario } from '../interfaces/usuario.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ILoginResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/v1/auth';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  private currentUser = new BehaviorSubject<IUsuario | null>(this.getUsuario());
  currentUser$ = this.currentUser.asObservable();

  constructor(private http:HttpClient, private router: Router) { }
  
  private hasToken(): boolean {
  const token = localStorage.getItem('token');
  return !!token;
  }
  public getToken(): string | null {
    return localStorage.getItem('token');
  }
  private getUsuario(): IUsuario | null {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      return JSON.parse(usuario) as IUsuario;
  }
  return null;
}
  login(credentials: { nombre: string; password: string }): Observable<boolean> {
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
           // Notificamos a los suscriptores
          this.loggedIn.next(true);
          this.currentUser.next(response.usuario);
          this.router.navigate(['/home']);
        }
      }),
      map(response => !!response.token),
      catchError(error => {
        console.error('Error en el login:', error);
        // this.clearSession();
        return of(false);
      })
    );
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.loggedIn.next(false);
    this.currentUser.next(null);
  }
    logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return of(false);
    }
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}` 
  });
    // Ya no necesitamos el catchError aquí. El interceptor se encargará del 401.
  return this.http.post<ILoginResponse>(`${this.apiUrl}/validate-token`, {}, { headers }).pipe(
    map(response => {
      if (response && response.token) {
        localStorage.setItem('token', response.token); 
        this.loggedIn.next(true);
        return true;
      }
      // Si la respuesta no trae un token (caso improbable pero seguro de manejar)
      this.logout();
      return false;
    })
  );



  }


}
