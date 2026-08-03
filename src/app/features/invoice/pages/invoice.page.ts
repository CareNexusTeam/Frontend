import { Component, OnInit, inject, NgZone } from '@angular/core';
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
  private ngZone = inject(NgZone);

  invoices: Invoice[] = [];
  loading = false;

  invoiceForm = this.fb.group({
    patientId: [''],
    consultationId: [''],
    paidAmount: [0]
  });

  lookupPatientId = '';
  paymentInputs: { [invoiceID: number]: number } = {};

  // Toast State
  showToast = false;
  toastType: 'success' | 'error' | 'info' = 'success';
  toastTitle = '';
  toastMessage = '';
  private toastTimeout: any;

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.invoiceService.getAllInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoices', error);
        this.loading = false;
        this.triggerToast('error', 'Load Failed', 'Unable to fetch invoice records.');
      }
    });
  }

  createInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.triggerToast('info', 'Validation Error', 'Please complete the invoice fields before submitting.');
      return;
    }

    const payload = this.invoiceForm.value as unknown as Invoice;

    this.invoiceService.createInvoice(payload).subscribe({
      next: () => {
        this.loadInvoices();
        this.invoiceForm.reset({ paidAmount: 0 });
        this.triggerToast('success', 'Invoice Created', 'New invoice generated successfully.');
      },
      error: (error) => {
        console.error('Error creating invoice', error);
        this.triggerToast('error', 'Creation Failed', 'Could not create the invoice.');
      }
    });
  }

  lookupByPatient(): void {
    if (!this.lookupPatientId) {
      this.triggerToast('info', 'Search Empty', 'Please enter a Patient ID to search.');
      return;
    }

    this.loading = true;
    this.invoiceService.getInvoicesByPatient(Number(this.lookupPatientId)).subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
        this.triggerToast('info', 'Search Completed', `Found ${data.length} invoice(s) for Patient ID #${this.lookupPatientId}.`);
      },
      error: (error) => {
        console.error('Error looking up patient invoices', error);
        this.loading = false;
        this.triggerToast('error', 'Lookup Failed', 'Could not fetch invoices for the given Patient ID.');
      }
    });
  }

  showAll(): void {
    this.lookupPatientId = '';
    this.loadInvoices();
    this.triggerToast('info', 'Records Refreshed', 'Showing all invoice records.');
  }

  updatePayment(invoiceID: number): void {
    const amount = this.paymentInputs[invoiceID];
    if (!amount || amount <= 0) {
      this.triggerToast('info', 'Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }

    this.invoiceService.updatePayment(invoiceID, amount).subscribe({
      next: () => {
        this.paymentInputs[invoiceID] = 0;
        this.loadInvoices();
        this.triggerToast('success', 'Payment Recorded', `Payment of $${amount} applied to Invoice #${invoiceID}.`);
      },
      error: (error) => {
        console.error('Error updating payment', error);
        this.triggerToast('error', 'Payment Failed', `Unable to update payment for Invoice #${invoiceID}.`);
      }
    });
  }

  cancelInvoice(id: number): void {
    this.invoiceService.cancelInvoice(id).subscribe({
      next: () => {
        this.loadInvoices();
        this.triggerToast('info', 'Invoice Cancelled', `Invoice #${id} has been cancelled.`);
      },
      error: (error) => {
        console.error('Error cancelling invoice', error);
        this.triggerToast('error', 'Cancellation Failed', `Unable to cancel Invoice #${id}.`);
      }
    });
  }

  // Toast Notification Controller
  triggerToast(type: 'success' | 'error' | 'info', title: string, message: string): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastType = type;
    this.toastTitle = title;
    this.toastMessage = message;
    this.showToast = true;

    // Dismisses reliably inside NgZone after 4 seconds
    this.toastTimeout = setTimeout(() => {
      this.ngZone.run(() => {
        this.closeToast();
      });
    }, 4000);
  }

  closeToast(): void {
    this.showToast = false;
  }
}