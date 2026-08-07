import { Component, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { InsuranceClaimService } from '../services/insurance.service';
import { InsuranceClaim } from '../model/insurance.model';

@Component({
  selector: 'app-insurance-claims-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MainLayoutComponent],
  templateUrl: './insurance.page.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceClaimsPageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private claimService = inject(InsuranceClaimService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  claims: InsuranceClaim[] = [];
  loading = false;

  claimForm = this.fb.group({
    invoiceId: [''],
    insuranceProviderId: [''],
    claimAmount: [0]
  });

  filterStatus = '';
  lookupInvoiceId = '';

  // Toast Notification State
  showToast = false;
  toastType: 'success' | 'error' | 'info' = 'success';
  toastTitle = '';
  toastMessage = '';
  private toastTimeout: any;

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.loading = true;
    this.claimService.getAllClaims().subscribe({
      next: (data) => {
        this.claims = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading claims', error);
        this.loading = false;
        this.triggerToast('error', 'Load Failed', 'Unable to fetch insurance claim records.');
      }
    });
  }

  createClaim(): void {
    if (this.claimForm.invalid) {
      this.triggerToast('info', 'Validation Error', 'Please fill in all claim details before submitting.');
      return;
    }
    const payload = this.claimForm.value as unknown as InsuranceClaim;

    this.claimService.createClaim(payload).subscribe({
      next: () => {
        this.loadClaims();
        this.claimForm.reset({ claimAmount: 0 });
        this.triggerToast('success', 'Claim Created', 'Insurance claim created successfully.');
      },
      error: (error) => {
        console.error('Error creating claim', error);
        this.triggerToast('error', 'Creation Failed', 'Could not create insurance claim.');
      }
    });
  }

  submitClaim(id: number): void {
    this.claimService.submitClaim(id).subscribe({
      next: () => {
        this.loadClaims();
        this.triggerToast('success', 'Claim Submitted', `Claim #${id} has been submitted for processing.`);
      },
      error: (error) => {
        console.error('Error submitting claim', error);
        this.triggerToast('error', 'Submission Failed', `Failed to submit claim #${id}.`);
      }
    });
  }

  updateStatus(claimID: number, status: string): void {
    if (!status) return;
    this.claimService.updateStatus(claimID, status).subscribe({
      next: () => {
        this.loadClaims();
        this.triggerToast('info', 'Status Updated', `Claim #${claimID} status changed to ${status}.`);
      },
      error: (error) => {
        console.error('Error updating claim status', error);
        this.triggerToast('error', 'Update Failed', `Could not update status for claim #${claimID}.`);
      }
    });
  }

  lookupByInvoice(): void {
    if (!this.lookupInvoiceId) {
      this.triggerToast('info', 'Search Empty', 'Please enter an Invoice ID to search.');
      return;
    }

    this.loading = true;
    this.claimService.getByInvoice(Number(this.lookupInvoiceId)).subscribe({
      next: (data) => {
        this.claims = data;
        this.loading = false;
        this.triggerToast('info', 'Search Results', `Found ${data.length} claim(s) for Invoice ID #${this.lookupInvoiceId}.`);
      },
      error: (error) => {
        console.error('Error looking up invoice claims', error);
        this.loading = false;
        this.triggerToast('error', 'Lookup Failed', 'Could not find claims for the specified Invoice ID.');
      }
    });
  }

  showAll(): void {
    this.filterStatus = '';
    this.lookupInvoiceId = '';
    this.loadClaims();
    this.triggerToast('info', 'Records Refreshed', 'Showing all insurance claims.');
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
