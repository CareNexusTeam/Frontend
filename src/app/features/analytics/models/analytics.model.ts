export interface ClinicalReport {
  reportId: number;
  scope: string;
  patientCount: number;
  bedOccupancy: number;
  avgConsultationTime: number;
  revenueCollected: number;
  generatedDate: string;
}

export interface RevenueMetrics {
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
}

export interface AppointmentStats {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface PrescriptionMetric {
  medicationName: string;
  count: number;
  percentage?: number;
}

export interface DepartmentPerformanceMetric {
  departmentId: number;
  departmentName: string;
  patientCount: number;
  revenue: number;
}
