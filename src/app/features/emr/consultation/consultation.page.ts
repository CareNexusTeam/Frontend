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
  selector: 'app-consultation-page',
  standalone: true,
  imports: [
      CommonModule,
      ReactiveFormsModule,
      MainLayoutComponent,
      EmrTabsComponent
],

  templateUrl: './consultation.page.html'
})
export class ConsultationPageComponent {

  consultationForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {

    this.consultationForm = this.fb.group({
      appointmentId: [''],
      patientId: [''],
      doctorId: [''],
      consultationDate: [''],
      symptoms: [''],
      diagnosis: [''],
      treatmentPlan: [''],
      status: ['InProgress']
    });

  }

  saveConsultation(): void {

    console.log(
      this.consultationForm.value
    );

  }

}