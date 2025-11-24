import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  nombre: string = '';
  password: string = '';
  isLoading: boolean = false;
  loginError= false;

  constructor(private authService: AuthService,private router: Router) { }

   login(): void {
   if (!this.nombre || !this.password) {
      this.loginError = true;
      return;
    }
      
    this.isLoading = true;
    this.loginError = false;

     const credentials = {
      nombre: this.nombre,
      password: this.password
    };
      // Nos suscribimos al resultado del login para manejar la UI en caso de error.
    this.authService.login(credentials).subscribe({
       next: (success: boolean) => {
          console.log("llega aqui");
        if (success) {
          // ¡AQUÍ! Si el login es exitoso, el componente navega.
          this.router.navigate(['/home']);
        } else {
          // Si el login falla, muestra el error.
          this.loginError = true;
          this.password = '';
        }
      },
      error: (err: any) => {
        console.error('Error en la suscripción del login:', err);
        this.loginError = true;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
   }
}
