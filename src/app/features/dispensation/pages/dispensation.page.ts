import { Component, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { DispensationService } from '../services/dispensation.service';
import { Dispensation } from '../model/dispensation.model';

@Component({
  selector: 'app-dispensation-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MainLayoutComponent],
  templateUrl: './dispensation.page.html',
  styleUrls: ['./dispensation.component.css']
})
export class DispensationPageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dispensationService = inject(DispensationService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  dispensations: Dispensation[] = [];
  loading = false;
  resultMessage = '';

  dispenseForm = this.fb.group({
    prescriptionId: [''],
    userId: ['']
  });

  lookupPrescriptionId = '';


  showToast = false;
  toastType: 'success' | 'error' | 'info' = 'success';
  toastTitle = '';
  toastMessage = '';
  private toastTimeout: any;

  ngOnInit(): void {
    this.loadDispensations();
  }

  loadDispensations(): void {

    this.dispensationService.getAllDispensations().subscribe({
      next: (data) => {
        this.dispensations = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dispensations', error);
        this.loading = false;
        this.triggerToast('error', 'Load Failed', 'Failed to load dispensation records.');
      }
    });
  }

  dispenseDrug(): void {
    if (this.dispenseForm.invalid) {
      this.triggerToast('info', 'Validation Error', 'Please fill in all required form fields.');
      return;
    }
    const prescriptionId = Number(this.dispenseForm.value.prescriptionId);
    const userId = Number(this.dispenseForm.value.userId);

    this.dispensationService.dispenseDrug(prescriptionId, userId).subscribe({
      next: (result) => {
        this.resultMessage = result;
        this.loadDispensations();
        this.dispenseForm.reset();
        this.triggerToast('success', 'Medication Dispensed', result || 'Drug dispensed successfully.');
      },
      error: (error) => {
        console.error('Error dispensing drug', error);
        this.triggerToast('error', 'Dispensation Failed', 'Could not dispense medication. Please try again.');
      }
    });
  }

  showPending(): void {
    this.loading = true;
    this.dispensationService.getPendingDispensations().subscribe({
      next: (data) => {
        this.dispensations = data;
        this.loading = false;
        this.triggerToast('info', 'Filter Applied', `Showing ${data.length} pending dispensation(s).`);
      },
      error: (error) => {
        console.error('Error loading pending', error);
        this.loading = false;
        this.triggerToast('error', 'Filter Error', 'Failed to fetch pending dispensations.');
      }
    });
  }

  showHistory(): void {
    this.loading = true;
    this.dispensationService.getDispensationHistory().subscribe({
      next: (data) => {
        this.dispensations = data;
        this.loading = false;
        this.triggerToast('info', 'History Loaded', `Showing ${data.length} past dispensation record(s).`);
      },
      error: (error) => {
        console.error('Error loading history', error);
        this.loading = false;
        this.triggerToast('error', 'Load Error', 'Unable to fetch dispensation history.');
      }
    });
  }

  showAll(): void {
    this.lookupPrescriptionId = '';
    this.loadDispensations();
    this.triggerToast('info', 'Records Refreshed', 'Showing all dispensation records.');
  }


  deleteDispensation(dispensationID: number): void {
    this.dispensationService.deleteDispensation(dispensationID).subscribe({
      next: () => {
        this.loadDispensations();
        this.triggerToast('info', 'Records Deleted', 'Record deleted successfully.');
      },
      error: (error) => {
        console.error('Error deleting dispensation', error);
        this.triggerToast('error', 'Delete Failed', 'Failed to delete dispensation record.');
      }
    });
  }



  lookupByPrescription(): void {
    if (!this.lookupPrescriptionId) {
      this.triggerToast('info', 'Search Empty', 'Please enter a Prescription ID to search.');
      return;
    }
    this.loading = true;
    this.dispensationService.getByPrescription(Number(this.lookupPrescriptionId)).subscribe({
      next: (data) => {
        this.dispensations = data;
        this.loading = false;
        this.triggerToast('info', 'Lookup Results', `Found ${data.length} record(s) for ID #${this.lookupPrescriptionId}.`);
      },
      error: (error) => {
        console.error('Error looking up prescription', error);
        this.loading = false;
        this.triggerToast('error', 'Search Failed', 'Could not find records for the specified Prescription ID.');
      }
    });
  }

  // Toast Handler
  triggerToast(type: 'success' | 'error' | 'info', title: string, message: string): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }

    this.ngZone.run(() => {
      this.toastType = type;
      this.toastTitle = title;
      this.toastMessage = message;
      this.showToast = true;
      this.cdr.detectChanges();
    });

    this.toastTimeout = setTimeout(() => {
      this.closeToast();
    }, 3500);
  }

  closeToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.ngZone.run(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    });
  }
}
