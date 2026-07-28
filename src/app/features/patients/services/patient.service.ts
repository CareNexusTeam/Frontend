import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly baseUrl = 'http://localhost:8082/api/v1/patients';

  constructor(private http: HttpClient) { }

  /**
   * Fetch all patients
   * GET /api/v1/patients/all
   */
  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/all`);
  }

  /**
   * Create/Register a new patient
   * POST /api/v1/patients/create
   */
  createPatient(patientData: Patient): Observable<Patient> {
    return this.http.post<Patient>(
      `${this.baseUrl}/create`,
      patientData
    );
  }

  /**
   * Get patient by ID
   * GET /api/v1/patients/{patientId}
   */
  getPatientById(patientId: number): Observable<Patient> {
    return this.http.get<Patient>(
      `${this.baseUrl}/${patientId}`
    );
  }

  /**
   * Update patient status
   * PATCH /api/v1/patients/{patientId}/status
   */
  updatePatientStatus(
    patientId: number,
    status: string
  ): Observable<Patient> {

    const payload = {
      status: status
    };

    return this.http.patch<Patient>(
      `${this.baseUrl}/${patientId}/status`,
      payload
    );
  }

  /**
   * Delete patient permanently
   * DELETE /api/v1/patients/{patientId}
   */
  deletePatient(patientId: number): Observable<string> {
    return this.http.delete(
      `${this.baseUrl}/${patientId}`,
      { responseType: 'text' }
    );
  }
}