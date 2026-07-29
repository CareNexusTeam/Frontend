import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsPageComponent } from './pages/appointments.page';

describe('Appointments', () => {
  let component: AppointmentsPageComponent;
  let fixture: ComponentFixture<AppointmentsPageComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentsPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
