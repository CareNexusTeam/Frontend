import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Doctor Schedules</h2>
        <p class="text-sm text-slate-500">Doctors can add their available time slots</p>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Create Schedule</h3>
        <form (ngSubmit)="save()" #f="ngForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="label">Doctor ID</label>
            <input class="input" type="number" name="did" [(ngModel)]="form.doctorId" required /></div>
          <div><label class="label">Date</label>
            <input class="input" type="date" name="date" [(ngModel)]="form.date" required /></div>
          <div><label class="label">Start Time</label>
            <input class="input" type="time" name="st" [(ngModel)]="form.startTime" required /></div>
          <div><label class="label">End Time</label>
            <input class="input" type="time" name="et" [(ngModel)]="form.endTime" required /></div>
          <div><label class="label">Slot Duration (min)</label>
            <input class="input" type="number" name="sd" [(ngModel)]="form.slotDurationMinutes" required /></div>
          <div><label class="label">Available Slots</label>
            <input class="input" type="number" name="as" [(ngModel)]="form.availableSlots" required /></div>
          <div class="md:col-span-2">
            <button class="btn-primary" [disabled]="!f.valid || saving">
              {{ saving ? 'Saving...' : 'Add Schedule' }}
            </button>
            <span *ngIf="msg" class="ml-3 text-sm text-green-700">{{ msg }}</span>
            <span *ngIf="err" class="ml-3 text-sm text-red-600">{{ err }}</span>
          </div>
        </form>
      </div>

      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">All Schedules</h3>
          <button class="btn-outline" (click)="load()">Refresh</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-slate-50">
              <tr>
                <th class="table-th">ID</th><th class="table-th">Doctor</th>
                <th class="table-th">Date</th><th class="table-th">Start</th>
                <th class="table-th">End</th><th class="table-th">Slot(min)</th>
                <th class="table-th">Available</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of schedules">
                <td class="table-td">{{ s.scheduleID }}</td>
                <td class="table-td">{{ s.doctorId?.name || s.doctorID?.name || s.doctorId }}</td>
                <td class="table-td">{{ s.date }}</td>
                <td class="table-td">{{ s.startTime }}</td>
                <td class="table-td">{{ s.endTime }}</td>
                <td class="table-td">{{ s.slotDurationMinutes }}</td>
                <td class="table-td">{{ s.availableSlots }}</td>
              </tr>
              <tr *ngIf="!schedules.length">
                <td colspan="7" class="table-td text-center text-slate-500">No schedules yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class DoctorScheduleComponent implements OnInit {
  form: any = {};
  schedules: any[] = [];
  saving = false;
  msg = '';
  err = '';

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.api.get<any[]>('/api/v1/doctor-schedules/all').subscribe({
      next: (d) => (this.schedules = d),
      error: () => (this.schedules = []),
    });
  }

  save() {
    this.saving = true; this.msg = ''; this.err = '';
    this.api.post('/api/v1/doctor-schedules/create', this.form).subscribe({
      next: () => { this.saving = false; this.msg = 'Schedule created.'; this.form = {}; this.load(); },
      error: (e) => { this.saving = false; this.err = e?.error?.message || 'Failed.'; },
    });
  }
}
