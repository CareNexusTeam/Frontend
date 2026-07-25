export interface Appointment {

  appointmentId?: number;

  patientId: number;

  doctorId: number;

  departmentId: number;

  scheduledDateTime: string;

  type: string;

  status: string;

}
