import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../model/invoice.model';

@Injectable({ providedIn: 'root' })
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
    return this.http.post<Invoice>(`${this.API_URL}/invoices`, invoice);
  }

  getByStatus(status: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.API_URL}/invoices/status/${status}`);
  }

  getInvoicesByPatient(patientId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.API_URL}/invoices/patient/${patientId}`);
  }

  updatePayment(invoiceID: number, amount: number): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.API_URL}/invoices/${invoiceID}/payment?amount=${amount}`, {});
  }

  cancelInvoice(id: number): Observable<string> {
    return this.http.put(`${this.API_URL}/invoices/${id}/cancel`, {}, { responseType: 'text' });
  }
}