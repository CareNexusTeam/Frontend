import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Drug } from '../model/drug-inventory.model';

@Injectable({ providedIn: 'root' })
export class DrugInventoryService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8082/api/drugs';

  // ==== JWT PLACEHOLDER (currently disabled) ====
  // private authHeaders() {
  //   return { headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` }) };
  // }
  // TEMP: no-auth (remove this comment block + pass authHeaders() into each call when JWT is enabled)

  addDrug(drug: Drug): Observable<Drug> {
    return this.http.post<Drug>(this.API_URL, drug);
  }

  getDrugById(drugId: number): Observable<Drug> {
    return this.http.get<Drug>(`${this.API_URL}/${drugId}`);
  }

  getAllDrugs(): Observable<Drug[]> {
    return this.http.get<Drug[]>(this.API_URL);
  }

  filterDrugs(category: string, status: string): Observable<Drug[]> {
    return this.http.get<Drug[]>(`${this.API_URL}?category=${category}&status=${status}`);
  }

  deleteDrug(drugId: number): Observable<string> {
    return this.http.delete(`${this.API_URL}/${drugId}`,
       { responseType: 'text' });
  }

  updateStock(drugId: number, quantity: number): Observable<Drug> {
    return this.http.patch<Drug>(`${this.API_URL}/${drugId}/stock?quantity=${quantity}`, {});
  }

  updateStatus(drugId: number, status: string): Observable<Drug> {
    return this.http.patch<Drug>(`${this.API_URL}/${drugId}/status?status=${status}`, {});
  }

  searchDrugs(keyword: string): Observable<Drug[]> {
    return this.http.get<Drug[]>(`${this.API_URL}/search?keyword=${keyword}`);
  }

  getExpiringDrugs(): Observable<Drug[]> {
    return this.http.get<Drug[]>(`${this.API_URL}/expiring`);
  }

  getLowStock(): Observable<Drug[]> {
    return this.http.get<Drug[]>(`${this.API_URL}/low-stock`);
  }
}
