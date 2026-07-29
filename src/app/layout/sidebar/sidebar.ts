import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService }
from '../../core/auth/auth-service';

interface MenuItem {

  name: string;

  route: string;

  icon?: string;

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
  ) {}

  ngOnInit(): void {

    const role =
      this.authService.getRole();

    const allMenus: MenuItem[] = [

      {
        
        name: 'Patients',
        route: '/patients',
         icon: './assets/icons/patients.png',
        roles: [
          'Admin',
          'Doctor',
          'Nurse',
          'Patient'
        ]
      },

      {
        name: 'Doctor Schedules',
        route: '/doctor-schedules',
        icon: './assets/icons/patient.png',
        roles: [
          'Admin',
          'Doctor',
          'Nurse'
        ]
      },

      {
        name: 'Appointments',
        route: '/appointments',
        icon: './assets/icons/patient.png',
        roles: [
          'Admin',
          'Doctor',
          'Nurse',
          'Patient'
        ]
      },

      {
        name: 'EMR',
        route: '/consultation',
        icon: './assets/icons/patient.png',
        roles: [
          'Admin',
          'Doctor'
        ]
      },

     {
  name: 'Drug Inventory',
  route: '/drug-inventory',
  icon: './assets/icons/patient.png',
  roles: [
    'Admin',
    'Pharmacist'
  ]
},

{
  name: 'Dispensation',
  route: '/dispensation',
  roles: [
    'Admin',
    'Pharmacist'
  ]
},

{
  name: 'Invoice',
  route: '/invoice',
  roles: [
    'Admin',
    'Billing'
  ]
},

{
  name: 'Insurance Claims',
  route: '/insurance',
  roles: [
    'Admin',
    'Billing'
  ]
},
      {
        name: 'Audit Logs',
        route: '/audit-logs',
        roles: [
          'Admin',
          'Compliance'
        ]
      }

    ];

    this.menus =
      allMenus.filter(
        menu =>
          menu.roles.includes(role)
      );

  }

}