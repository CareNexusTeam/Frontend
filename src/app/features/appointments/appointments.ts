import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent
  ],
  templateUrl: './appointments.html'
})
export class AppointmentsComponent {

  appointmentForm: FormGroup;

  appointments: any[] = [];

  constructor(
    private fb: FormBuilder
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

  bookAppointment() {

    const appointment = {
      id: this.appointments.length + 1,
      ...this.appointmentForm.value
    };

    this.appointments.push(appointment);

    this.appointmentForm.reset({
      type: 'Consultation',
      status: 'Scheduled'
    });
  }

  refreshAppointments() {
    console.log('Refreshing...');
  }

}
