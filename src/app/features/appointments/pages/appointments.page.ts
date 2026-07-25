import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { AppointmentService } from '../services/appointments.service';
import { Appointment } from '../models/appointments.model';

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainLayoutComponent
  ],
  templateUrl: './appointments.page.html'
})
export class AppointmentsPageComponent
implements OnInit {

  appointments: Appointment[] = [];

  loading = true;

  appointmentForm: FormGroup;

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

    setTimeout(() => {
      this.loadAppointments();
    });

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

    const payload =
      this.appointmentForm.value as Appointment;

    this.appointmentService
      .createAppointment(payload)
      .subscribe({

        next: () => {

          this.loadAppointments();

          this.appointmentForm.reset({
            type: 'Consultation',
            status: 'Scheduled'
          });

        },

        error: (error: any) => {

          console.error(
            'Error creating appointment',
            error
          );

        }

      });

  }

  refreshAppointments(): void {

    this.loadAppointments();

  }

}
