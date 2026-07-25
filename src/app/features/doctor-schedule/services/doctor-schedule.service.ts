import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DoctorSchedule } from '../models/doctor-schedule.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorScheduleService {

  private http = inject(HttpClient);

  private readonly API_URL =
    'http://localhost:8082/api/v1/doctor-schedules';

  createSchedule(
    schedule: DoctorSchedule
  ): Observable<DoctorSchedule> {

    return this.http.post<DoctorSchedule>(
      `${this.API_URL}/create`,
      schedule
    );
  }

  getAllSchedules(): Observable<DoctorSchedule[]> {

    return this.http.get<DoctorSchedule[]>(
      `${this.API_URL}/all`
    );
  }

  getScheduleById(
    id: number
  ): Observable<DoctorSchedule> {

    return this.http.get<DoctorSchedule>(
      `${this.API_URL}/${id}`
    );
  }

  getSchedulesByDoctorId(
    doctorId: number
  ): Observable<DoctorSchedule[]> {

    return this.http.get<DoctorSchedule[]>(
      `${this.API_URL}/doctor/${doctorId}`
    );
  }

  updateSchedule(
    id: number,
    schedule: DoctorSchedule
  ): Observable<DoctorSchedule> {

    return this.http.put<DoctorSchedule>(
      `${this.API_URL}/${id}`,
      schedule
    );
  }

  patchSchedule(
    id: number,
    payload: any
  ): Observable<DoctorSchedule> {

    return this.http.patch<DoctorSchedule>(
      `${this.API_URL}/${id}`,
      payload
    );
  }

  deleteSchedule(
    id: number
  ): Observable<string> {

    return this.http.delete(
      `${this.API_URL}/${id}`,
      {
        responseType: 'text'
      }
    );
  }

}
