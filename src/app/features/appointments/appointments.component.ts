import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Appointments</h2>
        <p class="text-sm text-slate-500">Book an appointment with a doctor</p>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Book Appointment</h3>
        <form (ngSubmit)="save()" #f="ngForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="label">Patient ID</label>
            <input class="input" type="number" name="pid" [(ngModel)]="form.patientID" required /></div>
          <div><label class="label">Doctor ID</label>
            <input class="input" type="number" name="did" [(ngModel)]="form.doctorID" required /></div>
          <div><label class="label">Department ID</label>
            <input class="input" type="number" name="dept" [(ngModel)]="form.departmentId" /></div>
          <div><label class="label">Scheduled Date & Time</label>
            <input class="input" type="datetime-local" name="dt" [(ngModel)]="form.scheduledDateTime" required /></div>
          <div><label class="label">Type</label>
            <select class="input" name="type" [(ngModel)]="form.type" required>
              <option value="Consultation">Consultation</option>
              <option value="FollowUp">Follow Up</option>
              <option value="Emergency">Emergency</option>
            </select></div>
          <div><label class="label">Status</label>
            <select class="input" name="status" [(ngModel)]="form.status" required>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select></div>
          <div class="md:col-span-2">
            <button class="btn-primary" [disabled]="!f.valid || saving">
              {{ saving ? 'Booking...' : 'Book Appointment' }}
            </button>
            <span *ngIf="msg" class="ml-3 text-sm text-green-700">{{ msg }}</span>
            <span *ngIf="err" class="ml-3 text-sm text-red-600">{{ err }}</span>
          </div>
        </form>
      </div>

      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">All Appointments</h3>
          <button class="btn-outline" (click)="load()">Refresh</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-slate-50">
              <tr>
                <th class="table-th">ID</th><th class="table-th">Patient</th>
                <th class="table-th">Doctor</th><th class="table-th">Date/Time</th>
                <th class="table-th">Type</th><th class="table-th">Status</th>
                <th class="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of appointments">
                <td class="table-td">{{ a.appointmentID }}</td>
                <td class="table-td">{{ a.patientID?.name || a.patientID }}</td>
                <td class="table-td">{{ a.doctorID?.name || a.doctorID }}</td>
                <td class="table-td">{{ a.scheduledDateTime }}</td>
                <td class="table-td">{{ a.type }}</td>
                <td class="table-td">{{ a.status }}</td>
                <td class="table-td">
                  <button class="text-red-600 text-sm hover:underline" (click)="remove(a.appointmentID)">Cancel</button>
                </td>
              </tr>
              <tr *ngIf="!appointments.length">
                <td colspan="7" class="table-td text-center text-slate-500">No appointments yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AppointmentsComponent implements OnInit {
  form: any = { status: 'Scheduled', type: 'Consultation' };
  appointments: any[] = [];
  saving = false;
  msg = '';
  err = '';

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.api.get<any[]>('/api/v1/appointments/all').subscribe({
      next: (d) => (this.appointments = d),
      error: () => (this.appointments = []),
    });
  }

  save() {
    this.saving = true; this.msg = ''; this.err = '';
    this.api.post('/api/v1/appointments/create', this.form).subscribe({
      next: () => { this.saving = false; this.msg = 'Appointment booked.'; this.form = { status: 'Scheduled', type: 'Consultation' }; this.load(); },
      error: (e) => { this.saving = false; this.err = e?.error?.message || 'Failed.'; },
    });
  }

  remove(id: number) {
    if (!confirm('Cancel this appointment?')) return;
    this.api.delete(`/api/v1/appointments/${id}`).subscribe({ next: () => this.load() });
  }
}
