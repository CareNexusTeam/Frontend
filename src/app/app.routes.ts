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
  path: 'consultation',
  loadComponent: () =>
    import('./features/emr/consultation/consultation.page')
      .then(m => m.ConsultationPageComponent)
},

{
  path: 'prescription',
  loadComponent: () =>
    import('./features/emr/prescription/prescription.page')
      .then(m => m.PrescriptionPageComponent)
},

{
  path: 'referral',
  loadComponent: () =>
    import('./features/emr/referral/referral.page')
      .then(m => m.ReferralPageComponent)
},

  {
    path: '**',
    redirectTo: 'appointments'
  }

];
