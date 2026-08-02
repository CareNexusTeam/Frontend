import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClinicalReport, RevenueMetrics, AppointmentStats, PrescriptionMetric, DepartmentPerformanceMetric, AnalyticsSummary } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private apiUrl = 'http://localhost:8082/api/analytics';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // GET complete analytics summary
  getAnalyticsSummary(startDate?: string, endDate?: string): Observable<AnalyticsSummary> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<AnalyticsSummary>(`${this.apiUrl}/summary`, {
      headers: this.getHeaders(),
      params
    });
  }

  // GET patient volume metric
  getPatientVolume(startDate?: string, endDate?: string, departmentId?: number): Observable<{ patientCount: number }> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (departmentId) params = params.set('departmentId', departmentId.toString());

    return this.http.get<{ patientCount: number }>(`${this.apiUrl}/patient-volume`, {
      headers: this.getHeaders(),
      params
    });
  }

  // GET financial revenue metrics
  getRevenueMetrics(startDate?: string, endDate?: string): Observable<RevenueMetrics> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<RevenueMetrics>(`${this.apiUrl}/revenue`, {
      headers: this.getHeaders(),
      params
    });
  }

  // GET appointment statistics
  getAppointmentStats(startDate?: string, endDate?: string): Observable<AppointmentStats> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<AppointmentStats>(`${this.apiUrl}/appointments`, {
      headers: this.getHeaders(),
      params
    });
  }

  // GET top prescribed medications ranking
  getPrescriptions(limit: number = 10): Observable<PrescriptionMetric[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<PrescriptionMetric[]>(`${this.apiUrl}/prescriptions`, {
      headers: this.getHeaders(),
      params
    });
  }

  // GET department performance metrics
  getDepartmentPerformance(startDate?: string, endDate?: string): Observable<DepartmentPerformanceMetric[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<DepartmentPerformanceMetric[]>(`${this.apiUrl}/department-performance`, {
      headers: this.getHeaders(),
      params
    });
  }

  // GET all generated clinical reports
  getAllReports(): Observable<ClinicalReport[]> {
    return this.http.get<ClinicalReport[]>(`${this.apiUrl}/reports`, {
      headers: this.getHeaders()
    });
  }

  // POST generate clinical report on demand
  generateReport(scope: string, startDate?: string, endDate?: string): Observable<ClinicalReport> {
    let params = new HttpParams().set('scope', scope);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.post<ClinicalReport>(`${this.apiUrl}/reports/generate`, {}, {
      headers: this.getHeaders(),
      params
    });
  }
}
