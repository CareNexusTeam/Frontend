import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth-service';
import { AuthService } from '../../core/auth/auth-service';

interface MenuItem {
  name: string;
  route: string;
  iconSvg: string;
  iconSvg: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html'
})
export class SidebarComponent implements OnInit {

  collapsed = false;
  menus: MenuItem[] = [];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    const userRole = (this.authService.getRole() || '').toLowerCase().replace('role_', '');
    const userRole = (this.authService.getRole() || '').toLowerCase().replace('role_', '');

    const allMenus: MenuItem[] = [
      {
        name: 'Patients',
        route: '/patients',
        iconSvg: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        roles: ['Admin', 'Doctor', 'Nurse', 'Patient', 'Receptionist']
      },
      {
        name: 'Medical History',
        route: '/medical-history',
        iconSvg: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        roles: ['Admin', 'Doctor']
        iconSvg: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        roles: ['Admin', 'Doctor', 'Nurse', 'Patient', 'Receptionist']
      },
      {
        name: 'Medical History',
        route: '/medical-history',
        iconSvg: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        roles: ['Admin', 'Doctor']
      },
      {
        name: 'Doctor Schedules',
        route: '/doctor-schedules',
        iconSvg: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        roles: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient']
        iconSvg: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        roles: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Patient']
      },
      {
        name: 'Appointments',
        route: '/appointments',
        iconSvg: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        roles: ['Admin', 'Doctor', 'Nurse', 'Patient', 'Receptionist']
        iconSvg: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        roles: ['Admin', 'Doctor', 'Nurse', 'Patient', 'Receptionist']
      },
      {
        name: 'EMR',
        route: '/consultation',
        iconSvg: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
        roles: ['Admin', 'Doctor']
        iconSvg: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
        roles: ['Admin', 'Doctor']
      },
      {
        name: 'Drug Inventory',
        route: '/drug-inventory',
        iconSvg: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
        roles: ['Admin', 'Pharmacist']
      },
      {
        name: 'Dispensation',
        route: '/dispensation',
        iconSvg: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z',
        roles: ['Admin', 'Pharmacist']
      },
      {
        name: 'Invoice',
        route: '/invoice',
        iconSvg: 'M9 7h6m-6 4h6m-6 4h6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        roles: ['Admin', 'Billing']
      },
      {
        name: 'Insurance Claims',
        route: '/insurance',
        iconSvg: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        roles: ['Admin', 'Billing']
      },
      {
        name: 'Analytics',
        route: '/analytics',
        iconSvg: 'M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        roles: ['Admin', 'Doctor', 'Billing', 'Compliance']
      },
    ];


    this.menus = allMenus.filter(menu =>
      menu.roles.some(r => r.toLowerCase() === userRole)
    );
  }
}