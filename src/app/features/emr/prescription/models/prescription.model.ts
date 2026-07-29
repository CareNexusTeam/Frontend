export interface Prescription {

  prescriptionId?: number;

  consultationId: number;

  patientId: number;

  medicationName: string;

  dosage: string;

  frequency: string;

  durationDays: number;

  status: string;

}