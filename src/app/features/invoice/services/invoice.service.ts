import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../model/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:8082/api';

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.API_URL}/invoices`);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.API_URL}/invoices/${id}`);
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(
      `${this.API_URL}/invoices`,
      invoice
    );
  }

  getInvoicesByPatient(patientId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(
      `${this.API_URL}/invoices/patients/${patientId}/invoices`
    );
  }

  updatePayment(
    invoiceID: number,
    amount: number
  ): Observable<Invoice> {

    return this.http.patch<Invoice>(
      `${this.API_URL}/invoices/${invoiceID}/payment?amount=${amount}`,
      {}
    );
  }

  cancelInvoice(id: number): Observable<Invoice> {

    return this.http.patch<Invoice>(
      `${this.API_URL}/invoices/${id}/cancel`,
      {}
    );
  }


}
