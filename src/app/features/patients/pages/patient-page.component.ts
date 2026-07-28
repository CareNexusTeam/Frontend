import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';
import { MainLayoutComponent } from "../../../layout/main-layout/main-layout";

@Component({
  selector: 'app-patient-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MainLayoutComponent],
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.css']
})
export class PatientManagementPageComponent implements OnInit {
  patientForm!: FormGroup;
  patientsList: Patient[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  userRole: string = 'Patient'; // Default role

  genderOptions: string[] = ['Male', 'Female', 'Other'];
  bloodGroupOptions: string[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  statusOptions: string[] = ['Active', 'Inactive'];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    // LocalStorage se role get karo
    const savedRole = localStorage.getItem('user_role');
    if (savedRole) {
      this.userRole = savedRole;
    }

    this.initForm();

    // Agar Patient nahi hai (Admin, Doctor, Nurse h), tabhi list fetch karo
    if (this.userRole !== 'Patient') {
      this.fetchPatients();
    }
  }

  private initForm(): void {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      emergencyContact: ['', Validators.required],
      insuranceProviderId: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  fetchPatients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patientsList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching patients:', err);
        this.errorMessage = 'Failed to load patients list from backend.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) return;

    this.isLoading = true;
    const newPatientData: Patient = this.patientForm.value;

    this.patientService.createPatient(newPatientData).subscribe({
      next: () => {
        this.patientForm.reset({ status: 'Active' });
        
        // Form submit hone ke baad table tabhi refresh karo agar admin/doctor view ho
        if (this.userRole !== 'Patient') {
          this.fetchPatients();
        } else {
          alert('Patient registered successfully!');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error saving patient:', err);
        alert('Failed to register patient!');
        this.isLoading = false;
      }
    });
  }
}