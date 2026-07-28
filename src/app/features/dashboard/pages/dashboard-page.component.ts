import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    MainLayoutComponent
  ],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {

  constructor(
    public authService: AuthService
  ) {}

}