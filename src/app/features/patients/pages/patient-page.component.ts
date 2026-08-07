import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { MainLayoutComponent } from "../../../layout/main-layout/main-layout";
import { ToastService } from '../../../layout/toast/toast.service';

@Component({
  selector: 'app-patient-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MainLayoutComponent],
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.css']
})
export class PatientManagementPageComponent implements OnInit {
  patientForm!: FormGroup;
  editPatientForm!: FormGroup;
  
  patientsList: any[] = [];
  filteredPatientsList: any[] = [];
  searchTerm: string = '';

  isLoading: boolean = false;
  isUpdating: boolean = false;
  isEditModalOpen: boolean = false;
  selectedPatient: any = null;

  errorMessage: string = '';
  userRole: string = 'Patient'; 

  genderOptions: string[] = ['Male', 'Female', 'Other'];
  bloodGroupOptions: string[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  statusOptions: string[] = ['Active', 'Inactive'];

  private toastService = inject(ToastService);

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedRole = localStorage.getItem('user_role');
    if (savedRole) {
      this.userRole = savedRole;
    }

    this.initForms();
    this.fetchPatients();
  }

  private initForms(): void {
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

    this.editPatientForm = this.fb.group({
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
    this.cdr.detectChanges(); // Fixes NG0100 for isLoading state

    this.patientService.getAllPatients().subscribe({
      next: (response: any) => {
        const rawList = Array.isArray(response) ? response : [];

        this.patientsList = rawList.map((p: any) => ({
          ...p,
          id: p.patientId || p.id || 'N/A'
        }));

        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching patients:', err);
        this.errorMessage = 'Failed to load patients list.';
        this.patientsList = [];
        this.filteredPatientsList = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim();
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredPatientsList = [...this.patientsList];
    } else {
      this.filteredPatientsList = this.patientsList.filter((p: any) => {
        const patientIdStr = String(p.id || p.patientId || '').toLowerCase();
        const searchStr = this.searchTerm.toLowerCase().replace('#', '');
        return patientIdStr.includes(searchStr);
      });
    }
    this.cdr.detectChanges();
  }

  private formatStatus(status: string): string {
    if (!status) return 'Active';
    const cleanStr = status.trim();
    if (cleanStr.toLowerCase() === 'active') return 'Active';
    if (cleanStr.toLowerCase() === 'inactive') return 'Inactive';
    return cleanStr;
  }

  onSubmit(): void {

    // if (this.patientForm.invalid) return;

    this.isLoading = true;
    this.cdr.detectChanges(); // Fixes NG0100: ExpressionChangedAfterItHasBeenCheckedError

    const formVal = this.patientForm.value;

    const payload = {
      name: formVal.name,
      dateOfBirth: formVal.dob,
      gender: formVal.gender,
      bloodGroup: formVal.bloodGroup,
      phone: formVal.phone,
      email: formVal.email,
      address: formVal.address,
      emergencyContact: formVal.emergencyContact,
      insuranceProviderId: Number(formVal.insuranceProviderId),
      status: this.formatStatus(formVal.status)
    };

    this.patientService.createPatient(payload).subscribe({
      next: () => {
        this.patientForm.reset({ status: 'Active' });
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastService.showToast('success', 'Patient Registered', 'Patient registered successfully!');
        this.fetchPatients();
      },
      error: (err) => {
        console.error('Error saving patient:', err);
        this.toastService.showToast('error', 'Registration Failed', 'Failed to register patient!');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openEditModal(patient: any): void {
    this.selectedPatient = patient;

    let formattedDob = patient.dateOfBirth || patient.dob || '';
    if (formattedDob && String(formattedDob).includes('T')) {
      formattedDob = String(formattedDob).split('T')[0];
    }

    this.editPatientForm.patchValue({
      name: patient.name,
      dob: formattedDob,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      insuranceProviderId: patient.insuranceProviderId,
      status: this.formatStatus(patient.status)
    });

    this.isEditModalOpen = true;
    this.cdr.detectChanges();
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedPatient = null;
    this.cdr.detectChanges();
  }

  // UPDATE HANDLER
  onUpdatePatient(): void {
    const patientId = Number(this.selectedPatient?.patientId || this.selectedPatient?.id);
    if (!patientId) {
      this.toastService.showToast('info', 'Validation Error', 'Invalid Patient ID');
      return;
    }

    this.isUpdating = true;
    this.cdr.detectChanges(); // Fixes NG0100 for isUpdating state

    const formVal = this.editPatientForm.value;

    let cleanDob = formVal.dob;
    if (cleanDob && cleanDob.includes('T')) {
      cleanDob = cleanDob.split('T')[0];
    }

    const patientDtoPayload = {
      patientId: patientId,
      name: formVal.name,
      dateOfBirth: cleanDob,
      gender: formVal.gender,
      bloodGroup: formVal.bloodGroup,
      phone: formVal.phone,
      email: formVal.email,
      address: formVal.address,
      emergencyContact: formVal.emergencyContact,
      insuranceProviderId: Number(formVal.insuranceProviderId),
      status: this.formatStatus(formVal.status)
    };

    this.patientService.updatePatientStatus(patientId, patientDtoPayload).subscribe({
      next: () => {
        this.isUpdating = false;
        this.closeEditModal();
        this.fetchPatients();
        this.toastService.showToast('success', 'Patient Updated', 'Patient updated successfully!');
      },
      error: (err) => {
        console.error('Update Error:', err);
        this.toastService.showToast('error', 'Update Failed', 'Failed to update patient details.');
        this.isUpdating = false;
        this.cdr.detectChanges();
      }
    });
  }

  // DELETE HANDLER
  onDeletePatient(patient: any): void {
    const patientId = Number(patient.patientId || patient.id);
    if (!patientId || isNaN(patientId)) {
      this.toastService.showToast('info', 'Validation Error', 'Invalid Patient ID!');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete patient "${patient.name}" (#${patientId})?`);
    if (!confirmDelete) return;

    this.patientService.deletePatient(patientId).subscribe({
      next: (responseMsg) => {
        this.toastService.showToast('success', 'Patient Deleted', responseMsg || 'Patient record permanently deleted!');
        this.fetchPatients();
      },
      error: (err) => {
        console.error('Delete Error:', err);
        if (err.status === 400 || err.status === 500) {
          // Soft delete option warning
          const trySoftDelete = confirm(
            `Patient #${patientId} cannot be hard deleted because they have existing appointment/medical records in the system.\n\nWould you like to mark this patient as INACTIVE instead?`
          );
          
          if (trySoftDelete) {
            this.softDeletePatient(patient);
          }
        } else if (err.status === 403) {
          this.toastService.showToast('error', 'Access Denied', 'Unauthorized: Only ADMIN can delete patient records.');
        } else {
          this.toastService.showToast('error', 'Delete Failed', 'Failed to delete patient record!');
        }
      }
    });
  }

  // Soft Delete Fallback Handler (Sets Status to Inactive)
  private softDeletePatient(patient: any): void {
    const patientId = Number(patient.patientId || patient.id);
    const softDeletePayload = {
      ...patient,
      patientId: patientId,
      dateOfBirth: patient.dateOfBirth || patient.dob,
      status: 'Inactive'
    };

    this.patientService.updatePatientStatus(patientId, softDeletePayload).subscribe({
      next: () => {
        this.toastService.showToast('info', 'Status Updated', `Patient #${patientId} has been successfully marked as INACTIVE.`);
        this.fetchPatients();
      },
      error: (err) => {
        console.error('Soft Delete Error:', err);
        this.toastService.showToast('error', 'Deactivation Failed', 'Failed to deactivate patient.');
      }
    });
  }
}