import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'appointments',
    pathMatch: 'full'
  },

  {
    path: 'appointments',
    loadComponent: () =>
      import('./features/appointments/appointments')
        .then(m => m.AppointmentsComponent)
  },


{
  path: 'doctor-schedules',
  loadComponent: () =>
    import('./features/doctor-schedule/doctor-schedule')
      .then(m => m.DoctorScheduleComponent)
},

  {
    path: '**',
    redirectTo: 'appointments'
  }

];
