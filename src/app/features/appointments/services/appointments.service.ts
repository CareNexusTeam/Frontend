import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Appointment } from '../models/appointments.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private http = inject(HttpClient);

  private readonly API_URL =
    'http://localhost:8082/api/v1/appointments';

  createAppointment(
    appointment: Appointment
  ): Observable<Appointment> {

    return this.http.post<Appointment>(
      `${this.API_URL}/create`,
      appointment
    );
  }

  getAllAppointments(): Observable<Appointment[]> {

    return this.http.get<Appointment[]>(
      `${this.API_URL}/all`
    );
  }

  getAppointmentById(
    id: number
  ): Observable<Appointment> {

    return this.http.get<Appointment>(
      `${this.API_URL}/${id}`
    );
  }

  updateAppointment(
    id: number,
    appointment: Appointment
  ): Observable<Appointment> {

    return this.http.put<Appointment>(
      `${this.API_URL}/${id}`,
      appointment
    );
  }

  deleteAppointment(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.API_URL}/${id}`
    );
  }
}
