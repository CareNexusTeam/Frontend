import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Prescription } from '../models/prescription.model';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private http = inject(HttpClient);

  private readonly API_URL =
    'http://localhost:8082/api/prescriptions';

  createPrescription(
    prescription: Prescription
  ): Observable<Prescription> {

    return this.http.post<Prescription>(
      this.API_URL,
      prescription
    );

  }

  getAllPrescriptions():
    Observable<Prescription[]> {

    return this.http.get<Prescription[]>(
      this.API_URL
    );

  }

  getPrescriptionById(
    id: number
  ): Observable<Prescription> {

    return this.http.get<Prescription>(
      `${this.API_URL}/${id}`
    );

  }

  getPrescriptionsByPatientId(
    patientId: number
  ): Observable<Prescription[]> {

    return this.http.get<Prescription[]>(
      `${this.API_URL}/patient/${patientId}`
    );

  }

  getPrescriptionsByConsultationId(
    consultationId: number
  ): Observable<Prescription[]> {

    return this.http.get<Prescription[]>(
      `${this.API_URL}/consultation/${consultationId}`
    );

  }

  updatePrescription(
    id: number,
    prescription: Prescription
  ): Observable<Prescription> {

    return this.http.put<Prescription>(
      `${this.API_URL}/${id}`,
      prescription
    );

  }

  deletePrescription(
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