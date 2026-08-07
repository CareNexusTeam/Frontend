import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { EmrTabsComponent } from '../components/emr-tabs';

import { Consultation } from '../../emr/consultation/models/consultation.model';
import { ConsultationService } from '../../emr/consultation/services/consultation.service';
import { ToastService } from '../../../layout/toast/toast.service';

@Component({
  selector: 'app-consultation-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MainLayoutComponent,
    EmrTabsComponent
  ],
  templateUrl: './consultation.page.html',
  styleUrl: './consultation.page.css'
})
export class ConsultationPageComponent
implements OnInit {

  consultationForm: FormGroup;

  consultations: Consultation[] = [];

  searchId = '';

  isEditMode = false;

  selectedConsultationId:
    number | null = null;

  private toastService = inject(ToastService);

  constructor(
    private fb: FormBuilder,
    private consultationService:
      ConsultationService
  ) {

    this.consultationForm =
      this.fb.group({

        appointmentId: [null],

        patientId: [null],

        doctorId: [null],

        consultationDate: [''],

        symptoms: [''],

        diagnosis: [''],

        treatmentPlan: [''],

        status: ['InProgress']

      });

  }

  ngOnInit(): void {

    this.loadConsultations();

  }

  loadConsultations(): void {

    this.consultationService
      .getAllConsultations()
      .subscribe({

        next: (response) => {

          this.consultations = response;

        },

        error: (error) => {

          console.error(
            'Error fetching consultations',
            error
          );

        }

      });

  }

  saveConsultation(): void {

    if (this.isEditMode) {

      this.updateConsultation();

      return;

    }

    this.consultationService
      .createConsultation(
        this.consultationForm.value
      )
      .subscribe({

        next: () => {
          this.toastService.showToast('success', 'Consultation Created', 'Consultation Created Successfully');
          this.clearForm();
          this.loadConsultations();
        },
        error: (error) => {
          console.error('Create Error', error);
          this.toastService.showToast('error', 'Creation Failed', 'Could not create consultation.');
        }

      });

  }

  editConsultation(
    consultation: Consultation
  ): void {

    if (
      !consultation.consultationId
    ) {
      return;
    }

    this.isEditMode = true;

    this.selectedConsultationId =
      consultation.consultationId;

    this.consultationForm.patchValue({

      appointmentId:
        consultation.appointmentId,

      patientId:
        consultation.patientId,

      doctorId:
        consultation.doctorId,

      consultationDate:
        consultation.consultationDate,

      symptoms:
        consultation.symptoms,

      diagnosis:
        consultation.diagnosis,

      treatmentPlan:
        consultation.treatmentPlan,

      status:
        consultation.status

    });

  }

  updateConsultation(): void {

    if (
      this.selectedConsultationId ===
      null
    ) {
      return;
    }

    this.consultationService
      .updateConsultation(
        this.selectedConsultationId,
        this.consultationForm.value
      )
      .subscribe({

        next: () => {
          this.toastService.showToast('success', 'Consultation Updated', 'Consultation Updated Successfully');
          this.isEditMode = false;
          this.selectedConsultationId = null;
          this.clearForm();
          this.loadConsultations();
        },
        error: (error) => {
          console.error('Update Error', error);
          this.toastService.showToast('error', 'Update Failed', 'Could not update consultation.');
        }

      });

  }

  deleteConsultation(
    id: number
  ): void {

    if (
      !confirm(
        'Are you sure you want to delete this consultation?'
      )
    ) {
      return;
    }

    this.consultationService
      .deleteConsultation(id)
      .subscribe({

        next: () => {
          this.toastService.showToast('success', 'Consultation Deleted', 'Consultation Deleted Successfully');
          this.loadConsultations();
        },
        error: (error) => {
          console.error('Delete Error', error);
          this.toastService.showToast('error', 'Delete Failed', 'Could not delete consultation.');
        }

      });

  }

  searchConsultation(): void {

    if (
      this.searchId.trim() === ''
    ) {

      this.loadConsultations();

      return;

    }

    this.consultationService
      .getConsultationById(
        Number(this.searchId)
      )
      .subscribe({

        next: (response) => {

          this.consultations = [
            response
          ];

        },

        error: (error) => {
          console.error('Search Error', error);
          this.toastService.showToast('error', 'Not Found', 'Consultation Not Found');
        }

      });

  }

  refreshConsultations(): void {

    this.searchId = '';

    this.loadConsultations();

  }

  clearForm(): void {

    this.consultationForm.reset({

      appointmentId: null,

      patientId: null,

      doctorId: null,

      consultationDate: '',

      symptoms: '',

      diagnosis: '',

      treatmentPlan: '',

      status: 'InProgress'

    });

    this.isEditMode = false;

    this.selectedConsultationId =
      null;

  }

}