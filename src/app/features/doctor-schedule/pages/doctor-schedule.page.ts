import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { DoctorScheduleService } from '../services/doctor-schedule.service';
import { DoctorSchedule } from '../models/doctor-schedule.model';

@Component({
  selector: 'app-doctor-schedule-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainLayoutComponent
  ],
  templateUrl: './doctor-schedule.page.html',
})
export class DoctorSchedulePageComponent
implements OnInit {

  schedules: DoctorSchedule[] = [];

  loading = false;

  scheduleForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private doctorScheduleService:
      DoctorScheduleService
  ) {}

  ngOnInit(): void {

    this.scheduleForm = this.fb.group({
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      slotDurationMinutes: [
        '',
        Validators.required
      ],
      availableSlots: [
        '',
        Validators.required
      ]
    });

    this.loadSchedules();

  }

  loadSchedules(): void {

    this.loading = true;

    this.doctorScheduleService
      .getAllSchedules()
      .subscribe({

        next: (
          response: DoctorSchedule[]
        ) => {

          this.schedules = response;

          this.loading = false;
        },

        error: (error: any) => {

          console.error(error);

          this.loading = false;
        }

      });

  }

  addSchedule(): void {

    if (this.scheduleForm.invalid) {
      return;
    }

    const payload =
      this.scheduleForm.value as DoctorSchedule;

    this.doctorScheduleService
      .createSchedule(payload)
      .subscribe({

        next: () => {

          this.loadSchedules();

          this.scheduleForm.reset();

        },

        error: (error: any) => {

          console.error(error);

        }

      });

  }

  deleteSchedule(id: number): void {

    this.doctorScheduleService
      .deleteSchedule(id)
      .subscribe({

        next: () => {

          this.loadSchedules();

        },

        error: (error: any) => {

          console.error(error);

        }

      });

  }

  refreshSchedules(): void {

    this.loadSchedules();

  }

}
