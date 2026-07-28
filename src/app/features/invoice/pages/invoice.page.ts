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

  filterStatus = '';
  lookupPatientId = '';
  paymentInputs: { [invoiceID: number]: number } = {};

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
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

  applyStatusFilter(): void {
    if (!this.filterStatus) { this.loadInvoices(); return; }
    this.loading = true;
    this.invoiceService.getByStatus(this.filterStatus).subscribe({
      next: (data) => { this.invoices = data; this.loading = false; },
      error: (error) => { console.error('Error filtering invoices', error); this.loading = false; }
    });
  }

  lookupByPatient(): void {
    if (!this.lookupPatientId) return;
    this.loading = true;
    this.invoiceService.getInvoicesByPatient(Number(this.lookupPatientId)).subscribe({
      next: (data) => { this.invoices = data; this.loading = false; },
      error: (error) => { console.error('Error looking up patient invoices', error); this.loading = false; }
    });
  }

  showAll(): void {
    this.filterStatus = '';
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

  // ---- Print invoice ----
  printInvoice(inv: Invoice): void {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Invoice #${inv.invoiceID}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            .sub { color: #666; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            td, th { text-align: left; padding: 8px 4px; border-bottom: 1px solid #ddd; }
            .total-row td { font-weight: bold; border-top: 2px solid #333; }
            .status { display: inline-block; padding: 4px 10px; border-radius: 6px;
                      background: #e6fbf5; color: #0f766e; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Invoice #${inv.invoiceID}</h1>
          <div class="sub">Date: ${inv.invoiceDate ?? '-'}</div>

          <table>
            <tr><th>Patient ID</th><td>${inv.patientId}</td></tr>
            <tr><th>Consultation ID</th><td>${inv.consultationId}</td></tr>
            <tr><th>Total Amount</th><td>${inv.totalAmount ?? '-'}</td></tr>
            <tr><th>Paid Amount</th><td>${inv.paidAmount}</td></tr>
            <tr><th>Outstanding</th><td>${inv.outstandingAmount ?? '-'}</td></tr>
            <tr class="total-row"><th>Status</th><td><span class="status">${inv.status}</span></td></tr>
          </table>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }
}