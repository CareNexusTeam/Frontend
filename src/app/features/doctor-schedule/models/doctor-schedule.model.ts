export interface DoctorSchedule {

  scheduleId?: number;

  doctorId: number;

  date: string;

  startTime: string;

  endTime: string;

  slotDurationMinutes: number;

  availableSlots: number;

}
