import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Referral } from '../models/referral.model';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {

  private http = inject(HttpClient);

  private readonly API_URL =
    'http://localhost:8082/api/referrals';

  createReferral(
    referral: Referral
  ): Observable<Referral> {

    return this.http.post<Referral>(
      this.API_URL,
      referral
    );

  }

  getAllReferrals():
    Observable<Referral[]> {

    return this.http.get<Referral[]>(
      this.API_URL
    );

  }

  getReferralById(
    id: number
  ): Observable<Referral> {

    return this.http.get<Referral>(
      `${this.API_URL}/${id}`
    );

  }

  getReferralsByConsultationId(
    consultationId: number
  ): Observable<Referral[]> {

    return this.http.get<Referral[]>(
      `${this.API_URL}/consultation/${consultationId}`
    );

  }

  getReferralsByStatus(
    status: string
  ): Observable<Referral[]> {

    return this.http.get<Referral[]>(
      `${this.API_URL}/status/${status}`
    );

  }

  getReferralsByPriority(
    priority: string
  ): Observable<Referral[]> {

    return this.http.get<Referral[]>(
      `${this.API_URL}/priority/${priority}`
    );

  }

  updateReferral(
    id: number,
    referral: Referral
  ): Observable<Referral> {

    return this.http.put<Referral>(
      `${this.API_URL}/${id}`,
      referral
    );

  }

  deleteReferral(
    id: number
  ): Observable<string> {

    return this.http.delete(
      `${this.API_URL}/${id}`,
      {
        responseType: 'text'
      }
    );

  }

}