import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { EmrTabsComponent } from '../components/emr-tabs';

import { PrescriptionService } from '../../emr/prescription/services/prescription.service';
import { Prescription } from '../../emr/prescription/models/prescription.model';

@Component({
  selector: 'app-prescription-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MainLayoutComponent,
    EmrTabsComponent
  ],
  templateUrl: './prescription.page.html',
  styleUrl: './prescription.page.css'
})
export class PrescriptionPageComponent implements OnInit {

  prescriptionForm: FormGroup;

  prescriptions: Prescription[] = [];

  searchId = '';

  isEditMode = false;

  selectedPrescriptionId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService
  ) {

    this.prescriptionForm = this.fb.group({
      consultationId: [null],
      patientId: [null],
      medicationName: [''],
      dosage: [''],
      frequency: [''],
      duration: [null],
      status: ['Issued']
    });

  }

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {

    this.prescriptionService
      .getAllPrescriptions()
      .subscribe({

        next: (response) => {
          this.prescriptions = response;
        },

        error: (error) => {
          console.error(
            'Error fetching prescriptions',
            error
          );
        }

      });

  }

  savePrescription(): void {

    if (this.isEditMode) {

      this.updatePrescription();
      return;

    }

    this.prescriptionService
      .createPrescription(
        this.prescriptionForm.value
      )
      .subscribe({

        next: () => {

          alert(
            'Prescription Created Successfully'
          );

          this.clearForm();

          this.loadPrescriptions();

        },

        error: (error) => {

          console.error(
            'Create Error',
            error
          );

        }

      });

  }

  editPrescription(
    prescription: Prescription
  ): void {

    if (!prescription.prescriptionId) {
      return;
    }

    this.isEditMode = true;

    this.selectedPrescriptionId =
      prescription.prescriptionId;

    this.prescriptionForm.patchValue({

      consultationId:
        prescription.consultationId,

      patientId:
        prescription.patientId,

      medicationName:
        prescription.medicationName,

      dosage:
        prescription.dosage,

      frequency:
        prescription.frequency,

      duration:
        prescription.duration,

      status:
        prescription.status

    });

  }

  updatePrescription(): void {

    if (
      this.selectedPrescriptionId === null
    ) {
      return;
    }

    this.prescriptionService
      .updatePrescription(
        this.selectedPrescriptionId,
        this.prescriptionForm.value
      )
      .subscribe({

        next: () => {

          alert(
            'Prescription Updated Successfully'
          );

          this.isEditMode = false;

          this.selectedPrescriptionId =
            null;

          this.clearForm();

          this.loadPrescriptions();

        },

        error: (error) => {

          console.error(
            'Update Error',
            error
          );

        }

      });

  }

  deletePrescription(
    id: number
  ): void {

    if (
      !confirm(
        'Delete this prescription?'
      )
    ) {
      return;
    }

    this.prescriptionService
      .deletePrescription(id)
      .subscribe({

        next: () => {

          alert(
            'Prescription Deleted Successfully'
          );

          this.loadPrescriptions();

        },

        error: (error) => {

          console.error(
            'Delete Error',
            error
          );

        }

      });

  }

  searchPrescription(): void {

    if (!this.searchId.trim()) {

      this.loadPrescriptions();
      return;

    }

    this.prescriptionService
      .getPrescriptionById(
        Number(this.searchId)
      )
      .subscribe({

        next: (response) => {

          this.prescriptions =
            [response];

        },

        error: (error) => {

          console.error(
            'Search Error',
            error
          );

          alert(
            'Prescription Not Found'
          );

        }

      });

  }

  refreshPrescriptions(): void {

    this.searchId = '';

    this.loadPrescriptions();

  }

  clearForm(): void {

    this.prescriptionForm.reset({

      consultationId: null,
      patientId: null,
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: null,
      status: 'Issued'

    });

  }

}