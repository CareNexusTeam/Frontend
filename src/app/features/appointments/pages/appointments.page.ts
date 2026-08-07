import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { AppointmentService } from '../services/appointments.service';
import { Appointment } from '../models/appointments.model';
import { ToastService } from '../../../layout/toast/toast.service';

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MainLayoutComponent,
  ],
  templateUrl: './appointments.page.html',
  styleUrl: './appointments.page.css'
})
export class AppointmentsPageComponent implements OnInit {

  appointments: Appointment[] = [];

  loading = true;

  searchId = '';

  isEditMode = false;

  selectedAppointmentId: number | null = null;

  appointmentForm: FormGroup;

  private toastService = inject(ToastService);

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService
  ) {

    this.appointmentForm = this.fb.group({
      patientId: [''],
      doctorId: [''],
      departmentId: [''],
      scheduledDateTime: [''],
      type: ['Consultation'],
      status: ['Scheduled']
    });

  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {

    this.loading = true;

    this.appointmentService
      .getAllAppointments()
      .subscribe({

        next: (response: Appointment[]) => {

          this.appointments = response;

          this.loading = false;

        },

        error: (error: any) => {

          console.error(
            'Error loading appointments',
            error
          );

          this.loading = false;

        }

      });

  }

  bookAppointment(): void {

    if (this.isEditMode) {

      this.updateAppointment();

      return;

    }

    const payload =
      this.appointmentForm.value as Appointment;

    this.appointmentService
      .createAppointment(payload)
      .subscribe({

        next: () => {
          this.toastService.showToast('success', 'Appointment Created', 'Appointment Created Successfully');
          this.clearForm();
          this.loadAppointments();
        },
        error: (error: any) => {
          console.error('Error creating appointment', error);
          this.toastService.showToast('error', 'Creation Failed', 'Could not create appointment.');
        }

      });

  }

  editAppointment(
    appointment: Appointment
  ): void {

    if (!appointment.appointmentId) {
      return;
    }

    this.isEditMode = true;

    this.selectedAppointmentId =
      appointment.appointmentId;

    this.appointmentForm.patchValue({

      patientId:
        appointment.patientId,

      doctorId:
        appointment.doctorId,

      departmentId:
        appointment.departmentId,

      scheduledDateTime:
        appointment.scheduledDateTime,

      type:
        appointment.type,

      status:
        appointment.status

    });

  }

  updateAppointment(): void {

    if (this.selectedAppointmentId === null) {
      return;
    }

    const payload =
      this.appointmentForm.value as Appointment;

    this.appointmentService
      .updateAppointment(
        this.selectedAppointmentId,
        payload
      )
      .subscribe({

        next: () => {
          this.toastService.showToast('success', 'Appointment Updated', 'Appointment Updated Successfully');
          this.isEditMode = false;
          this.selectedAppointmentId = null;
          this.clearForm();
          this.loadAppointments();
        },
        error: (error: any) => {
          console.error('Update Error', error);
          this.toastService.showToast('error', 'Update Failed', 'Could not update appointment.');
        }

      });

  }

  deleteAppointment(
    id: number
  ): void {

    if (
      !confirm(
        'Are you sure you want to delete this appointment?'
      )
    ) {
      return;
    }

    this.appointmentService
      .deleteAppointment(id)
      .subscribe({

        next: () => {
          this.toastService.showToast('success', 'Appointment Deleted', 'Appointment Deleted Successfully');
          this.loadAppointments();
        },
        error: (error: any) => {
          console.error('Delete Error', error);
          this.toastService.showToast('error', 'Delete Failed', 'Could not delete appointment.');
        }

      });

  }

  searchAppointment(): void {

    if (
      this.searchId.trim() === ''
    ) {

      this.loadAppointments();

      return;

    }

    this.appointmentService
      .getAppointmentById(
        Number(this.searchId)
      )
      .subscribe({

        next: (response: Appointment) => {

          this.appointments = [
            response
          ];

        },

        error: (error: any) => {
          console.error('Search Error', error);
          this.toastService.showToast('error', 'Not Found', 'Appointment Not Found');
        }

      });

  }

  refreshAppointments(): void {

    this.searchId = '';

    this.loadAppointments();

  }

  clearForm(): void {

    this.appointmentForm.reset({

      patientId: '',

      doctorId: '',

      departmentId: '',

      scheduledDateTime: '',

      type: 'Consultation',

      status: 'Scheduled'

    });

  }

}