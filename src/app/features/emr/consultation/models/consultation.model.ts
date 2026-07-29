export interface Consultation {

  consultationId?: number;

  appointmentId: number;

  patientId: number;

  doctorId: number;

  consultationDate: string;

  symptoms: string;

  diagnosis: string;

  treatmentPlan: string;

  status: string;

}