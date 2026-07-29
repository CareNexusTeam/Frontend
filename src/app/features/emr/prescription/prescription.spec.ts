import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionPageComponent } from './prescription.page';

describe('PrescriptionPageComponent', () => {
  let component: PrescriptionPageComponent;
  let fixture: ComponentFixture<PrescriptionPageComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriptionPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
