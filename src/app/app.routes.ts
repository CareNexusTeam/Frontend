import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

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
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page.component')
        .then(m => m.DashboardPageComponent)
  },
  {
    path: 'patients',
    loadComponent: () =>
      import('./features/patients/pages/patient-page.component')
        .then(m => m.PatientManagementPageComponent)
  },


  {
    path: 'medical-history',
    canActivate: [RoleGuard.checkRole(['ADMIN', 'DOCTOR'])],
    loadComponent: () =>
      import('./features/medical-history/pages/medical-history-page.component')
        .then(m => m.MedicalHistoryPageComponent)
  },
  {
    path: 'consultation',
    canActivate: [RoleGuard.checkRole(['ADMIN', 'DOCTOR', 'PATIENT'])],
    loadComponent: () =>
      import('./features/emr/consultation/consultation.page')
        .then(m => m.ConsultationPageComponent)
  },

  {
    path: 'prescription',
    canActivate: [RoleGuard.checkRole(['ADMIN', 'DOCTOR', 'PATIENT'])],
    loadComponent: () =>
      import('./features/emr/prescription/prescription.page')
        .then(m => m.PrescriptionPageComponent)
  },
  {
    path: 'referral',
    canActivate: [RoleGuard.checkRole(['ADMIN', 'DOCTOR', 'PATIENT'])],
    loadComponent: () =>
      import('./features/emr/referral/referral.page')
        .then(m => m.ReferralPageComponent)
  },


  {
    path: 'doctor-schedules',
    loadComponent: () =>
      import('./features/doctor-schedule/pages/doctor-schedule.page')
        .then(m => m.DoctorSchedulePageComponent)
  },
  {
    path: 'appointments',
    canActivate: [RoleGuard.checkRole(['ADMIN', 'PATIENT', 'DOCTOR'])],
    loadComponent: () =>
      import('./features/appointments/pages/appointments.page')
        .then(m => m.AppointmentsPageComponent)
  },

  {
    path: 'drug-inventory',
    canActivate: [RoleGuard.checkRole(['ADMIN', 'PHARMACIST'])],
    loadComponent: () =>
      import('./features/drug-inventory/pages/drug-inventory.page')
        .then(m => m.DrugInventoryPageComponent)
  },
  {
    path: 'dispensation',
    canActivate: [RoleGuard.checkRole(['ADMIN', 'PHARMACIST'])],
    loadComponent: () =>
      import('./features/dispensation/pages/dispensation.page')
        .then(m => m.DispensationPageComponent)
  },
  {
    path: 'invoice',
    canActivate: [RoleGuard.checkRole(['ADMIN', 'BILLING', 'PATIENT'])],
    loadComponent: () =>
      import('./features/invoice/pages/invoice.page')
        .then(m => m.InvoicesPageComponent)
  },

  {
    path: 'insurance',
    canActivate: [RoleGuard.checkRole(['ADMIN', 'BILLING', 'PATIENT'])],
    loadComponent: () =>
      import('./features/insurance/pages/insurance.page')
        .then(m => m.InsuranceClaimsPageComponent)
  },

  {
    path: 'analytics',
    canActivate: [RoleGuard.checkRole(['ADMIN', 'DOCTOR', 'BILLING', 'COMPLIANCE'])],
    loadComponent: () =>
      import('./features/analytics/pages/analytics.page')
        .then(m => m.AnalyticsPageComponent)
  },


  {
    path: '**',
    redirectTo: 'login'
  }
];