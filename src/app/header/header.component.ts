import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { IUsuario } from '../interfaces/usuario.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  usuario$: Observable<IUsuario | null>;

   // 2. Inyecta el AuthService en el constructor
  constructor(private authService: AuthService) {
     this.usuario$ = this.authService.currentUser$;
  }
  
  // 3. Crea el método que será llamado desde el botón en el HTML
  logout(): void {
    this.authService.logout();
  }

}
