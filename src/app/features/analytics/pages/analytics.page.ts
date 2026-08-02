import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { ClinicalReport, RevenueMetrics, AppointmentStats, PrescriptionMetric, DepartmentPerformanceMetric, AnalyticsSummary } from '../models/analytics.model';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainLayoutComponent
  ],
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.css']
})
export class AnalyticsPageComponent implements OnInit {

  startDate: string = '';
  endDate: string = '';
  selectedScope: string = 'Period';
  isLoading: boolean = false;

  patientVolume: number = 0;
  avgConsultationTime: number = 0;
  bedOccupancy: number = 0;

  revenueMetrics: RevenueMetrics = {
    totalBilled: 0.0,
    totalCollected: 0.0,
    totalOutstanding: 0.0
  };

  appointmentStats: AppointmentStats = {
    total: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0
  };

  prescriptions: PrescriptionMetric[] = [];
  departmentPerformance: DepartmentPerformanceMetric[] = [];
  reports: ClinicalReport[] = [];

  reportForm: FormGroup;
  showForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private analyticsService: AnalyticsService
  ) {
    this.reportForm = this.fb.group({
      scope: ['Period', Validators.required],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadAllAnalytics();
  }

  loadAllAnalytics(): void {
    this.isLoading = true;

    // Fetch primary KPI Summary directly from DB API
    this.analyticsService.getAnalyticsSummary(this.startDate, this.endDate).subscribe({
      next: (summary: AnalyticsSummary) => {
        if (summary) {
          this.patientVolume = summary.patientVolume || 0;
          this.revenueMetrics = summary.revenueMetrics || { totalBilled: 0, totalCollected: 0, totalOutstanding: 0 };
          this.appointmentStats = summary.appointmentStats || { total: 0, completed: 0, cancelled: 0, noShow: 0 };
          this.avgConsultationTime = summary.avgConsultationTime || 0;
          this.bedOccupancy = summary.bedOccupancy || 0;
        }
      },
      error: (err) => {
        console.error('Error fetching analytics summary:', err);
        // Fallback individual metric calls
        this.fetchIndividualMetrics();
      }
    });

    // Fetch live Top Prescribed Medications
    this.analyticsService.getPrescriptions(10).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          const maxCount = Math.max(...res.map(p => p.count), 1);
          this.prescriptions = res.map(p => ({
            ...p,
            percentage: Math.round((p.count / maxCount) * 100)
          }));
        } else {
          this.prescriptions = [];
        }
      },
      error: (err) => {
        console.error('Error fetching prescriptions metrics:', err);
        this.prescriptions = [];
      }
    });

    // Fetch live Department Performance
    this.analyticsService.getDepartmentPerformance(this.startDate, this.endDate).subscribe({
      next: (res) => {
        this.departmentPerformance = res || [];
      },
      error: (err) => {
        console.error('Error fetching department performance:', err);
        this.departmentPerformance = [];
      }
    });

    this.loadReports();
  }

  private fetchIndividualMetrics(): void {
    this.analyticsService.getPatientVolume(this.startDate, this.endDate).subscribe({
      next: (res) => this.patientVolume = res?.patientCount || 0,
      error: () => this.patientVolume = 0
    });

    this.analyticsService.getRevenueMetrics(this.startDate, this.endDate).subscribe({
      next: (res) => this.revenueMetrics = res || { totalBilled: 0, totalCollected: 0, totalOutstanding: 0 },
      error: () => this.revenueMetrics = { totalBilled: 0, totalCollected: 0, totalOutstanding: 0 }
    });

    this.analyticsService.getAppointmentStats(this.startDate, this.endDate).subscribe({
      next: (res) => this.appointmentStats = res || { total: 0, completed: 0, cancelled: 0, noShow: 0 },
      error: () => this.appointmentStats = { total: 0, completed: 0, cancelled: 0, noShow: 0 }
    });
  }

  loadReports(): void {
    this.analyticsService.getAllReports().subscribe({
      next: (res) => {
        this.reports = res || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching clinical reports:', err);
        this.reports = [];
        this.isLoading = false;
      }
    });
  }

  toggleReportForm(): void {
    this.showForm = !this.showForm;
  }

  generateReport(): void {
    const val = this.reportForm.value;
    const scope = val.scope || 'Period';
    const sDate = val.startDate || this.startDate;
    const eDate = val.endDate || this.endDate;

    this.isLoading = true;
    this.analyticsService.generateReport(scope, sDate, eDate).subscribe({
      next: (newReport) => {
        if (newReport) {
          this.reports.unshift(newReport);
        }
        this.showForm = false;
        this.isLoading = false;
        alert('Clinical Report generated successfully from live DB metrics!');
      },
      error: (err) => {
        console.error('Error generating report:', err);
        this.showForm = false;
        this.isLoading = false;
        alert('Failed to generate report. Please verify database connectivity.');
      }
    });
  }

  applyFilters(): void {
    this.loadAllAnalytics();
  }
}
