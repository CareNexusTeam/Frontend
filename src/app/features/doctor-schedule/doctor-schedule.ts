import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent
  ],
  templateUrl: './doctor-schedule.html',
  styleUrls: ['./doctor-schedule.css']
})
export class DoctorScheduleComponent {

  scheduleForm: FormGroup;

  schedules: any[] = [];

  constructor(private fb: FormBuilder) {

    this.scheduleForm = this.fb.group({
      doctorId: [''],
      date: [''],
      startTime: [''],
      endTime: [''],
      slotDuration: [''],
      availableSlots: ['']
    });

  }

  addSchedule(): void {

    const schedule = {
      id: this.schedules.length + 1,
      ...this.scheduleForm.value
    };

    this.schedules.push(schedule);

    this.scheduleForm.reset();
  }

  refreshSchedules(): void {
    console.log('Refreshing schedules...');
  }

}
