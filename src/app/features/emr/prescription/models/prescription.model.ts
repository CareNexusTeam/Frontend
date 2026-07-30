export interface Prescription {

  prescriptionId?: number;

  consultationId: number;

  patientId: number;

  medicationName: string;

  dosage: string;

  frequency: string;

  duration: number;

  status: string;

}