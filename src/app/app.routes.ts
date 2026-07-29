import { Routes } from '@angular/router';

import { authGuard }
from './core/auth/auth.guard';

import { roleGuard }
from './core/auth/role.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/userAndIdentity/pages/login/login-page.component')
        .then(m => m.LoginPageComponent)
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./features/userAndIdentity/pages/signup/signup-page.component')
        .then(m => m.SignupPageComponent)
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page.component')
        .then(m => m.DashboardPageComponent)
  },

  {
    path: 'drug-inventory',

    canActivate: [
      authGuard,
      roleGuard
    ],

  data: {
    roles: [
      'Admin',
      'Pharmacist'
    ]
  },

  loadComponent: () =>
    import(
      './features/drug-inventory/pages/drug-inventory.page'
    ).then(
      m => m.DrugInventoryPageComponent
    )
},

{
  path: 'dispensation',

  canActivate: [
    authGuard,
    roleGuard
  ],

  data: {
    roles: [
      'Admin',
      'Pharmacist'
    ]
  },

  loadComponent: () =>
    import(
      './features/dispensation/pages/dispensation.page'
    ).then(
      m => m.DispensationPageComponent
    )
},

{
  path: 'invoice',

  canActivate: [
    authGuard,
    roleGuard
  ],

  data: {
    roles: [
      'Admin',
      'Billing'
    ]
  },

  loadComponent: () =>
    import(
      './features/invoice/pages/invoice.page'
    ).then(
      m => m.InvoicesPageComponent
    )
},

{
  path: 'insurance',

  canActivate: [
    authGuard,
    roleGuard
  ],

  data: {
    roles: [
      'Admin',
      'Billing'
    ]
  },

  loadComponent: () =>
    import(
      './features/insurance/pages/insurance.page'
    ).then(
      m => m.InsuranceClaimsPageComponent
    )
},
 

  {
    path: 'patients',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        'Admin',
        'Doctor',
        'Nurse',
        'Patient'
      ]
    },
    loadComponent: () =>
      import('./features/patients/pages/patient-page.component')
        .then(m => m.PatientManagementPageComponent)
  },

  {
    path: 'doctor-schedules',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        'Admin',
        'Doctor',
        'Nurse'
      ]
    },
    loadComponent: () =>
      import('./features/doctor-schedule/pages/doctor-schedule.page')
        .then(m => m.DoctorSchedulePageComponent)
  },

  {
    path: 'appointments',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        'Admin',
        'Doctor',
        'Nurse',
        'Patient'
      ]
    },
    loadComponent: () =>
      import('./features/appointments/pages/appointments.page')
        .then(m => m.AppointmentsPageComponent)
  },

  {
    path: 'consultation',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        'Admin',
        'Doctor',
        'Patient'
      ]
    },
    loadComponent: () =>
      import('./features/emr/consultation/consultation.page')
        .then(m => m.ConsultationPageComponent)
  },

  {
    path: 'prescription',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        'Admin',
        'Doctor',
        'Patient'
      ]
    },
    loadComponent: () =>
      import('./features/emr/prescription/prescription.page')
        .then(m => m.PrescriptionPageComponent)
  },

  {
    path: 'referral',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        'Admin',
        'Doctor',
        'Patient'
      ]
    },
    loadComponent: () =>
      import('./features/emr/referral/referral.page')
        .then(m => m.ReferralPageComponent)
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];