import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8082/api/v1/patients';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('jwt_token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // GET ALL PATIENTS (/api/v1/patients/all)
  getAllPatients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`, { headers: this.getHeaders() });
  }

  // GET PATIENT BY ID (/api/v1/patients/{patientId})
  getPatientById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // CREATE PATIENT (/api/v1/patients/create)
  createPatient(patientDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, patientDto, { headers: this.getHeaders() });
  }

  // UPDATE PATIENT STATUS/DETAILS (/api/v1/patients/{patientId}/status)
  updatePatientStatus(id: number | string, patientDto: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, patientDto, { headers: this.getHeaders() });
  }

  // DELETE PATIENT (/api/v1/patients/{patientId})
  deletePatient(id: number | string): Observable<any> {
    const token = localStorage.getItem('token') || localStorage.getItem('jwt_token') || '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: headers, 
      responseType: 'text' 
    });
  }
}