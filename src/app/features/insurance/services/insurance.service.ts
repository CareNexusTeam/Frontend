import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsuranceClaim } from '../model/insurance.model';

@Injectable({ providedIn: 'root' })
export class InsuranceClaimService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8082/api';

  getAllClaims(): Observable<InsuranceClaim[]> {
    return this.http.get<InsuranceClaim[]>(`${this.API_URL}/claims`);
  }

  getClaimById(id: number): Observable<InsuranceClaim> {
    return this.http.get<InsuranceClaim>(`${this.API_URL}/claims/${id}`);
  }

  createClaim(claim: InsuranceClaim): Observable<InsuranceClaim> {
    return this.http.post<InsuranceClaim>(`${this.API_URL}/claims`, claim);
  }

  submitClaim(id: number): Observable<InsuranceClaim> {
    return this.http.put<InsuranceClaim>(`${this.API_URL}/claims/${id}/submit`, {});
  }

  updateStatus(claimID: number, status: string): Observable<InsuranceClaim> {
    return this.http.put<InsuranceClaim>(`${this.API_URL}/claims/${claimID}/status?status=${status}`, {});
  }

  getByInvoice(invoiceId: number): Observable<InsuranceClaim[]> {
    return this.http.get<InsuranceClaim[]>(`${this.API_URL}/claims/invoice/${invoiceId}`);
  }

  getByStatus(status: string): Observable<InsuranceClaim[]> {
    return this.http.get<InsuranceClaim[]>(`${this.API_URL}/claims/status/${status}`);
  }
}