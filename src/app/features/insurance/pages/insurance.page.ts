import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { InsuranceClaimService } from '../services/insurance.service';
import { InsuranceClaim } from '../model/insurance.model';

@Component({
  selector: 'app-insurance-claims-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MainLayoutComponent],
  templateUrl: './insurance.page.html'
})
export class InsuranceClaimsPageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private claimService = inject(InsuranceClaimService);

  claims: InsuranceClaim[] = [];
  loading = false;

  claimForm = this.fb.group({
    invoiceId: [''],
    insuranceProviderId: [''],
    claimAmount: [0]
  });

  filterStatus = '';
  lookupInvoiceId = '';

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    
    this.claimService.getAllClaims().subscribe({
      next: (data) => { this.claims = data; this.loading = false; },
      error: (error) => { console.error('Error loading claims', error); this.loading = false; }
    });
  }

  createClaim(): void {
    if (this.claimForm.invalid) return;
    const payload = this.claimForm.value as unknown as InsuranceClaim;

    this.claimService.createClaim(payload).subscribe({
      next: () => {
        this.loadClaims();
        this.claimForm.reset({ claimAmount: 0 });
      },
      error: (error) => console.error('Error creating claim', error)
    });
  }

  submitClaim(id: number): void {
    this.claimService.submitClaim(id).subscribe({
      next: () => this.loadClaims(),
      error: (error) => console.error('Error submitting claim', error)
    });
  }

  updateStatus(claimID: number, status: string): void {
    if (!status) return;
    this.claimService.updateStatus(claimID, status).subscribe({
      next: () => this.loadClaims(),
      error: (error) => console.error('Error updating claim status', error)
    });
  }

  

  lookupByInvoice(): void {
    if (!this.lookupInvoiceId) return;
  
    this.claimService.getByInvoice(Number(this.lookupInvoiceId)).subscribe({
      next: (data) => { this.claims = data; this.loading = false; },
      error: (error) => { console.error('Error looking up invoice claims', error); this.loading = false; }
    });
  }

  showAll(): void {
    this.filterStatus = '';
    this.lookupInvoiceId = '';
    this.loadClaims();
  }
}