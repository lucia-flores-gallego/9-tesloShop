import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '@/auth/services/authService';

@Component({
  selector: 'front-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.html',
})
export class FrontNavbar {
  authService = inject(AuthService);
}