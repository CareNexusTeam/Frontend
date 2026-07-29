import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Consultation } from '../models/consultation.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  private http = inject(HttpClient);

  private readonly API_URL =
    'http://localhost:8082/api/consultations';

  createConsultation(
    consultation: Consultation
  ): Observable<Consultation> {

    return this.http.post<Consultation>(
      this.API_URL,
      consultation
    );

  }

  getAllConsultations():
    Observable<Consultation[]> {

    return this.http.get<Consultation[]>(
      this.API_URL
    );

  }

  getConsultationById(
    id: number
  ): Observable<Consultation> {

    return this.http.get<Consultation>(
      `${this.API_URL}/${id}`
    );

  }

  updateConsultation(
    id: number,
    consultation: Consultation
  ): Observable<Consultation> {

    return this.http.put<Consultation>(
      `${this.API_URL}/${id}`,
      consultation
    );

  }

  deleteConsultation(
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