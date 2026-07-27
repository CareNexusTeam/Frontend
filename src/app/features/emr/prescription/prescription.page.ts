import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { EmrTabsComponent }from '../components/emr-tabs';

@Component({
  selector: 'app-prescription-page',
  standalone: true,
  imports: [
        CommonModule,
        ReactiveFormsModule,
        MainLayoutComponent,
        EmrTabsComponent
  ],
  
  templateUrl: './prescription.page.html'
})
export class PrescriptionPageComponent {

  prescriptionForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {

    this.prescriptionForm = this.fb.group({
      consultationId: [''],
      patientId: [''],
      medicationName: [''],
      dosage: [''],
      frequency: [''],
      durationDays: [''],
      status: ['Issued']
    });

  }

  savePrescription(): void {

    console.log(
      this.prescriptionForm.value
    );

  }

}