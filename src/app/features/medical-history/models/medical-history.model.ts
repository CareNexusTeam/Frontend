export interface MedicalHistory {
  historyId?: number;
  patientId?: number;
  patientName?: string;
  condition: string;
  diagnosedDate: string;
  status: string;
}