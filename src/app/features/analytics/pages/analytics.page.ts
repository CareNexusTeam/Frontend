import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { ClinicalReport, RevenueMetrics, AppointmentStats, PrescriptionMetric, DepartmentPerformanceMetric } from '../models/analytics.model';

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

  startDate: string = '2026-07-01';
  endDate: string = '2026-07-26';
  selectedScope: string = 'Period';

  patientVolume: number = 148;

  revenueMetrics: RevenueMetrics = {
    totalBilled: 45000.0,
    totalCollected: 38500.0,
    totalOutstanding: 6500.0
  };

  appointmentStats: AppointmentStats = {
    total: 120,
    completed: 92,
    cancelled: 18,
    noShow: 10
  };

  prescriptions: PrescriptionMetric[] = [
    { medicationName: 'Amoxicillin 500mg', count: 45, percentage: 32 },
    { medicationName: 'Ibuprofen 400mg', count: 32, percentage: 23 },
    { medicationName: 'Paracetamol 650mg', count: 28, percentage: 20 },
    { medicationName: 'Metformin 500mg', count: 20, percentage: 14 },
    { medicationName: 'Atorvastatin 10mg', count: 15, percentage: 11 }
  ];

  departmentPerformance: DepartmentPerformanceMetric[] = [
    { departmentId: 101, departmentName: 'Cardiology', patientCount: 54, revenue: 16200.0 },
    { departmentId: 102, departmentName: 'Orthopedics', patientCount: 38, revenue: 11400.0 },
    { departmentId: 103, departmentName: 'Pediatrics', patientCount: 32, revenue: 6800.0 },
    { departmentId: 104, departmentName: 'Neurology', patientCount: 24, revenue: 4100.0 }
  ];

  reports: ClinicalReport[] = [
    {
      reportId: 1,
      scope: 'Period',
      patientCount: 148,
      bedOccupancy: 82,
      avgConsultationTime: 18.5,
      revenueCollected: 38500.0,
      generatedDate: '2026-07-26 08:00 AM'
    },
    {
      reportId: 2,
      scope: 'Department',
      patientCount: 54,
      bedOccupancy: 90,
      avgConsultationTime: 22.0,
      revenueCollected: 16200.0,
      generatedDate: '2026-07-25 05:30 PM'
    },
    {
      reportId: 3,
      scope: 'Doctor',
      patientCount: 38,
      bedOccupancy: 75,
      avgConsultationTime: 15.0,
      revenueCollected: 11400.0,
      generatedDate: '2026-07-24 01:15 PM'
    }
  ];

  reportForm: FormGroup;
  showForm: boolean = false;

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      scope: ['Period'],
      patientCount: [150],
      bedOccupancy: [80],
      avgConsultationTime: [18.0],
      revenueCollected: [35000.0]
    });
  }

  ngOnInit(): void {}

  toggleReportForm(): void {
    this.showForm = !this.showForm;
  }

  generateReport(): void {
    const val = this.reportForm.value;
    const newReport: ClinicalReport = {
      reportId: this.reports.length + 1,
      scope: val.scope || 'Period',
      patientCount: val.patientCount || 0,
      bedOccupancy: val.bedOccupancy || 0,
      avgConsultationTime: val.avgConsultationTime || 0,
      revenueCollected: val.revenueCollected || 0,
      generatedDate: new Date().toLocaleString()
    };
    this.reports.unshift(newReport);
    this.showForm = false;
  }

  applyFilters(): void {
    // Refresh metric visualizations based on date filter range
    this.patientVolume = Math.floor(120 + Math.random() * 50);
  }
}
