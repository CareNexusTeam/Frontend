import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { DispensationService } from '../services/dispensation.service';
import { Dispensation } from '../model/dispensation.model';

@Component({
  selector: 'app-dispensation-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MainLayoutComponent],
  templateUrl: './dispensation.page.html'
})
export class DispensationPageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dispensationService = inject(DispensationService);

  dispensations: Dispensation[] = [];
  loading = false;
  resultMessage = '';

  dispenseForm = this.fb.group({
    prescriptionId: [''],
    userId: ['']
  });

  lookupPrescriptionId = '';

  ngOnInit(): void {
    this.loadDispensations();
  }

  loadDispensations(): void {
    this.dispensationService.getAllDispensations().subscribe({
      next: (data) => { this.dispensations = data; this.loading = false; },
      error: (error) => { console.error('Error loading dispensations', error); this.loading = false; }
    });
  }

  dispenseDrug(): void {
    if (this.dispenseForm.invalid) return;
    const prescriptionId = Number(this.dispenseForm.value.prescriptionId);
    const userId = Number(this.dispenseForm.value.userId);

    this.dispensationService.dispenseDrug(prescriptionId, userId).subscribe({
      next: (result) => {
        this.resultMessage = result;
        this.loadDispensations();
        this.dispenseForm.reset();
      },
      error: (error) => console.error('Error dispensing drug', error)
    });
  }

  showPending(): void {
    this.dispensationService.getPendingDispensations().subscribe({
      next: (data) => { this.dispensations = data; this.loading = false; },
      error: (error) => { console.error('Error loading pending', error); this.loading = false; }
    });
  }

  showHistory(): void {
    this.dispensationService.getDispensationHistory().subscribe({
      next: (data) => { this.dispensations = data; this.loading = false; },
      error: (error) => { console.error('Error loading history', error); this.loading = false; }
    });
  }

  showAll(): void {
    this.lookupPrescriptionId = '';
    this.loadDispensations();
  }

  lookupByPrescription(): void {
    if (!this.lookupPrescriptionId) return;
    this.dispensationService.getByPrescription(Number(this.lookupPrescriptionId)).subscribe({
      next: (data) => { this.dispensations = data; this.loading = false; },
      error: (error) => { console.error('Error looking up prescription', error); this.loading = false; }
    });
  }
}