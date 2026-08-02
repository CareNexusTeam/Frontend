import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../model/invoice.model';

@Component({
  selector: 'app-invoices-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MainLayoutComponent],
  templateUrl: './invoice.page.html'
})
export class InvoicesPageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private invoiceService = inject(InvoiceService);

  invoices: Invoice[] = [];
  loading = false;

  invoiceForm = this.fb.group({
    patientId: [''],
    consultationId: [''],
    paidAmount: [0]
  });

  lookupPatientId = '';
  paymentInputs: { [invoiceID: number]: number } = {};

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    // this.loading = true;
    this.invoiceService.getAllInvoices().subscribe({
      next: (data) => { this.invoices = data; this.loading = false; },
      error: (error) => { console.error('Error loading invoices', error); this.loading = false; }
    });
  }

  createInvoice(): void {
    if (this.invoiceForm.invalid) return;
    const payload = this.invoiceForm.value as unknown as Invoice;

    this.invoiceService.createInvoice(payload).subscribe({
      next: () => {
        this.loadInvoices();
        this.invoiceForm.reset({ paidAmount: 0 });
      },
      error: (error) => console.error('Error creating invoice', error)
    });
  }



  lookupByPatient(): void {
    if (!this.lookupPatientId) return;
    // this.loading = true;
    this.invoiceService.getInvoicesByPatient(Number(this.lookupPatientId)).subscribe({
      next: (data) => { this.invoices = data; this.loading = false; },
      error: (error) => { console.error('Error looking up patient invoices', error); this.loading = false; }
    });
  }

  showAll(): void {

    this.lookupPatientId = '';
    this.loadInvoices();
  }

  updatePayment(invoiceID: number): void {
    const amount = this.paymentInputs[invoiceID];
    if (!amount) return;
    this.invoiceService.updatePayment(invoiceID, amount).subscribe({
      next: () => { this.paymentInputs[invoiceID] = 0; this.loadInvoices(); },
      error: (error) => console.error('Error updating payment', error)
    });
  }

  cancelInvoice(id: number): void {
    this.invoiceService.cancelInvoice(id).subscribe({
      next: () => this.loadInvoices(),
      error: (error) => console.error('Error cancelling invoice', error)
    });
  }


}
