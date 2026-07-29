import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSchedulePageComponent } from './pages/doctor-schedule.page';

describe('DoctorSchedule', () => {
  let component: DoctorSchedulePageComponent;
  let fixture: ComponentFixture<DoctorSchedulePageComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSchedulePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorSchedulePageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
