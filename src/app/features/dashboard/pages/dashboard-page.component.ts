import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent
  ],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
  private authService = inject(AuthService);

  // Store basic user identity without loading secondary data
  userName = this.authService.getUserName();
  userRole = this.authService.getRole();
}
