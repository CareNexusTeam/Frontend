import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispensation } from '../model/dispensation.model';

@Injectable({ providedIn: 'root' })
export class DispensationService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8082/api';


  dispenseDrug(prescriptionId: number, userId: number): Observable<string> {
    return this.http.post(
      `${this.API_URL}/dispensations?prescriptionId=${prescriptionId}&userId=${userId}`,
      {},
      { responseType: 'text' }
    );
  }

  getAllDispensations(): Observable<Dispensation[]> {
    return this.http.get<Dispensation[]>(`${this.API_URL}/dispensations`);
  }

  getDispensationById(id: number): Observable<Dispensation> {
    return this.http.get<Dispensation>(`${this.API_URL}/dispensations/${id}`);
  }

  getPendingDispensations(): Observable<Dispensation[]> {
    return this.http.get<Dispensation[]>(`${this.API_URL}/dispensations/pending`);
  }

  getDispensationHistory(): Observable<Dispensation[]> {
    return this.http.get<Dispensation[]>(`${this.API_URL}/dispensations/history`);
  }

  getByPrescription(prescriptionId: number): Observable<Dispensation[]> {
    return this.http.get<Dispensation[]>(`${this.API_URL}/prescriptions/${prescriptionId}/dispensation`);
  }
  deleteDispensation(dispensationID: number): Observable<string> {
    return this.http.delete(`${this.API_URL}/dispensations/${dispensationID}`,{ responseType: 'text' });
  }
}
