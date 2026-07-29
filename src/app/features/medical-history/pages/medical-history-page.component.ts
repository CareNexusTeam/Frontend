import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. ChangeDetectorRef imported
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { MedicalHistory } from '../models/medical-history.model';
import { MedicalHistoryService } from '../services/medical-history.service';
import { PatientService } from '../../patients/services/patient.service';

@Component({
  selector: 'app-medical-history-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MainLayoutComponent],
  templateUrl: './medical-history-page.component.html' 
})
export class MedicalHistoryPageComponent implements OnInit {
  medicalHistoryForm!: FormGroup;
  editForm!: FormGroup;

  medicalHistoryList: MedicalHistory[] = [];
  currentPatientName: string = 'N/A';
  searchPatientId: number | null = null;

  isSaving = false;
  isUpdating = false;

  isEditModalOpen = false;
  selectedRecordToEdit: MedicalHistory | null = null;

  statusOptions: string[] = ['Active', 'Resolved'];

  constructor(
    private fb: FormBuilder,
    private medicalHistoryService: MedicalHistoryService,
    private patientService: PatientService,
    private cdr: ChangeDetectorRef // 2. Injected ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    this.medicalHistoryForm = this.fb.group({
      patientId: ['', [Validators.required, Validators.min(1)]],
      condition: ['', Validators.required],
      diagnosedDate: ['', Validators.required],
      status: ['Active', Validators.required]
    });

    this.editForm = this.fb.group({
      condition: ['', Validators.required],
      diagnosedDate: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  // --- ADD MEDICAL HISTORY RECORD ---
  onSubmit(): void {
    if (this.medicalHistoryForm.invalid) return;

    this.isSaving = true;
    const formVal = this.medicalHistoryForm.value;
    const patientId = Number(formVal.patientId);

    let formattedDate = formVal.diagnosedDate;
    if (formattedDate && formattedDate.includes('T')) {
      formattedDate = formattedDate.split('T')[0];
    }

    const historyData = {
      patientId: patientId,
      condition: String(formVal.condition).trim(),
      diagnosedDate: String(formattedDate).trim(),
      status: formVal.status
    };

    this.medicalHistoryService.addMedicalHistory(patientId, historyData as any).subscribe({
      next: (responseMessage) => {
        alert(responseMessage || 'Medical History record added successfully!');
        this.medicalHistoryForm.reset({ status: 'Active' });
        this.isSaving = false;

        this.searchPatientId = patientId;
        this.fetchPatientData(patientId);
      },
      error: (err) => {
        console.error('Error saving history record:', err);
        let detailedMsg = 'Failed to save record!';
        if (typeof err.error === 'string') {
          detailedMsg = err.error;
        } else if (err.error?.message) {
          detailedMsg = err.error.message;
        }
        alert(`Backend Error: ${detailedMsg}`);
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- SEARCH FILTER INPUT HANDLER ---
  onSearchInputChange(event: Event): void {
    const rawVal = (event.target as HTMLInputElement).value;
    const parsedId = Number(rawVal);

    if (rawVal !== '' && !isNaN(parsedId) && parsedId > 0) {
      this.searchPatientId = parsedId;
      this.fetchPatientData(parsedId);
    } else {
      this.searchPatientId = null;
      this.medicalHistoryList = [];
      this.currentPatientName = 'N/A';
      this.cdr.detectChanges();
    }
  }

  // --- FETCH DATA FROM BACKEND ---
  fetchPatientData(patientId: number): void {
    // 1. Fetch Patient Details
    if (this.patientService && typeof this.patientService.getPatientById === 'function') {
      this.patientService.getPatientById(patientId).subscribe({
        next: (patient) => {
          this.currentPatientName = patient?.name ? patient.name : `Patient #${patientId}`;
          this.cdr.detectChanges(); // Force UI Update
        },
        error: () => {
          this.currentPatientName = `Patient #${patientId}`;
          this.cdr.detectChanges(); // Force UI Update
        }
      });
    } else {
      this.currentPatientName = `Patient #${patientId}`;
    }

    // 2. Fetch Medical History Logs
    this.medicalHistoryService.getMedicalHistoryByPatient(patientId).subscribe({
      next: (data: any) => {
        console.log('Received Data:', data);
        
        if (Array.isArray(data)) {
          this.medicalHistoryList = [...data];
        } else if (data) {
          this.medicalHistoryList = [data];
        } else {
          this.medicalHistoryList = [];
        }

        // IMPORTANT: Ye line Angular UI screen ko zabardasti update karti hai
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.warn('Error fetching history:', err);
        this.medicalHistoryList = [];
        this.cdr.detectChanges(); // Force UI Update
      }
    });
  }

  // --- EDIT MODAL HANDLERS ---
  openEditModal(record: MedicalHistory): void {
    this.selectedRecordToEdit = record;
    this.editForm.patchValue({
      condition: record.condition,
      diagnosedDate: record.diagnosedDate,
      status: record.status
    });
    this.isEditModalOpen = true;
    this.cdr.detectChanges();
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedRecordToEdit = null;
    this.cdr.detectChanges();
  }

  // --- UPDATE RECORD STATUS ---
  onUpdateRecord(): void {
    if (this.editForm.invalid || !this.selectedRecordToEdit?.historyId) return;

    this.isUpdating = true;
    const historyId = this.selectedRecordToEdit.historyId;
    const updatedStatus = this.editForm.get('status')?.value;

    this.medicalHistoryService.updateHistoryStatus(historyId, updatedStatus).subscribe({
      next: () => {
        alert('Medical Record status updated successfully!');
        this.isUpdating = false;
        this.closeEditModal();

        if (this.searchPatientId) {
          this.fetchPatientData(this.searchPatientId);
        }
      },
      error: (err) => {
        console.error('Error updating record status:', err);
        alert('Failed to update record status!');
        this.isUpdating = false;
        this.cdr.detectChanges();
      }
    });
  }
}