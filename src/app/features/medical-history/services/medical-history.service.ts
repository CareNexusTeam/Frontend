import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalHistory } from '../models/medical-history.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {

  private readonly baseUrl = 'http://localhost:8082/api/v1/medical-histories';

  constructor(private http: HttpClient) { }

  /**
   * Helper to attach JWT Token in headers if present
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * GET /api/v1/medical-histories/patient/{patientId}
   */
  getMedicalHistoryByPatient(patientId: number): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${this.baseUrl}/patient/${patientId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * POST /api/v1/medical-histories/patient/{patientId}
   */
  addMedicalHistory(patientId: number, historyDto: MedicalHistory): Observable<string> {
    return this.http.post(`${this.baseUrl}/patient/${patientId}`, historyDto, {
      headers: this.getAuthHeaders(),
      responseType: 'text' // Backend returns ResponseEntity<String>
    });
  }

  /**
   * PATCH /api/v1/medical-histories/{historyId}/status
   * Sends JSON body payload matching @RequestBody MedicalHistoryDto
   */
  updateHistoryStatus(historyId: number, status: string): Observable<MedicalHistory> {
    const payload = { status: status }; 
    return this.http.patch<MedicalHistory>(
      `${this.baseUrl}/${historyId}/status`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }
}