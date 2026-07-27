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
//added by drug inventory

{
  path: 'drug-inventory',
  loadComponent: () =>
    import(
      './features/drug-inventory/pages/drug-inventory.page'
    ).then(
      m => m.DrugInventoryPageComponent)
    
},

{
  path: 'dispensation',
  loadComponent: () =>
    import('./features/dispensation/pages/dispensation.page')
      .then(m => m.DispensationPageComponent)
},

{
  path: 'invoice',
  loadComponent: () =>
    import('./features/invoice/pages/invoice.page')
      .then(m => m.InvoicesPageComponent)
},


{
  path: 'insurance',
  loadComponent: () =>
    import('./features/insurance/pages/insurance.page')
      .then(m => m.InsuranceClaimsPageComponent)
},

  {
    path: '**',
    redirectTo: 'appointments'
  }

];
