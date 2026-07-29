import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService }
from '../../core/auth/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html'
})
export class HeaderComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}