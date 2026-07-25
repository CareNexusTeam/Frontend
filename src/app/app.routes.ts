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
      import('./features/appointments/pages/appointments.page')
        .then(m => m.AppointmentsPageComponent)
  },


{
  path: 'doctor-schedules',
  loadComponent: () =>
    import(
      './features/doctor-schedule/pages/doctor-schedule.page'
    ).then(
      m => m.DoctorSchedulePageComponent
    )
},

  {
    path: '**',
    redirectTo: 'appointments'
  }

];
