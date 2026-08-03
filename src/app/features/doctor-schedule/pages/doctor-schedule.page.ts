import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
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
    FormsModule,
    MainLayoutComponent,
  ],
  templateUrl: './doctor-schedule.page.html',
  styleUrl: './doctor-schedule.css'
})
export class DoctorSchedulePageComponent
implements OnInit {

  schedules: DoctorSchedule[] = [];

  loading = false;

  searchId = '';

  isEditMode = false;

  selectedScheduleId: number | null = null;

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

    if (this.isEditMode) {

      this.updateSchedule();

      return;
    }

    const payload =
      this.scheduleForm.value as DoctorSchedule;

    this.doctorScheduleService
      .createSchedule(payload)
      .subscribe({

        next: () => {

          alert(
            'Schedule Created Successfully'
          );

          this.loadSchedules();

          this.clearForm();

        },

        error: (error: any) => {

          console.error(error);

        }

      });

  }

  editSchedule(
    schedule: DoctorSchedule
  ): void {

    if (!schedule.scheduleId) {
      return;
    }

    this.isEditMode = true;

    this.selectedScheduleId =
      schedule.scheduleId;

    this.scheduleForm.patchValue({

      doctorId:
        schedule.doctorId,

      date:
        schedule.date,

      startTime:
        schedule.startTime,

      endTime:
        schedule.endTime,

      slotDurationMinutes:
        schedule.slotDurationMinutes,

      availableSlots:
        schedule.availableSlots

    });

  }

  updateSchedule(): void {

    if (
      this.selectedScheduleId === null
    ) {
      return;
    }

    const payload =
      this.scheduleForm.value as DoctorSchedule;

    this.doctorScheduleService
      .updateSchedule(
        this.selectedScheduleId,
        payload
      )
      .subscribe({

        next: () => {

          alert(
            'Schedule Updated Successfully'
          );

          this.isEditMode = false;

          this.selectedScheduleId = null;

          this.clearForm();

          this.loadSchedules();

        },

        error: (error: any) => {

          console.error(
            'Update Error',
            error
          );

        }

      });

  }

  deleteSchedule(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this schedule?'
      )
    ) {
      return;
    }

    this.doctorScheduleService
      .deleteSchedule(id)
      .subscribe({

        next: () => {

          alert(
            'Schedule Deleted Successfully'
          );

          this.loadSchedules();

        },

        error: (error: any) => {

          console.error(error);

        }

      });

  }

  searchSchedule(): void {

    if (
      this.searchId.trim() === ''
    ) {

      this.loadSchedules();

      return;
    }

    this.doctorScheduleService
      .getScheduleById(
        Number(this.searchId)
      )
      .subscribe({

        next: (
          response: DoctorSchedule
        ) => {

          this.schedules = [
            response
          ];

        },

        error: (error: any) => {

          console.error(error);

          alert(
            'Schedule Not Found'
          );

        }

      });

  }

  refreshSchedules(): void {

    this.searchId = '';

    this.loadSchedules();

  }

  clearForm(): void {

    this.scheduleForm.reset({

      doctorId: '',

      date: '',

      startTime: '',

      endTime: '',

      slotDurationMinutes: '',

      availableSlots: ''

    });

  }

}