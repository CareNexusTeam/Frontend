import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {

  collapsed = false;

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }

  menus = [
    {
      name: 'Patients',
      route: '/patients'
    },
    {
      name: 'Doctor Schedules',
      route: '/doctor-schedules'
    },
    {
      name: 'Appointments',
      route: '/appointments'
    },
    {
      name: 'EMR',
      route: '/emr'
    },
    {
      name: 'Drug-inventory',
      route: '/drug-inventory'
    },
    {
      name: 'Dispensation',
      route: '/dispensation'
    },
      {
      name: 'Invoice',
      route: '/invoice'
    },
    {
      name: 'Insurance',
      route: '/insurance'
    },
    {
      name: 'Audit Logs',
      route: '/audit-logs'
    }
  ];

}
