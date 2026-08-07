import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';

import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { EmrTabsComponent } from '../components/emr-tabs';

import { ReferralService } from '../referral/services/referral.service';
import { Referral } from '../referral/models/referral.model';
import { ToastService } from '../../../layout/toast/toast.service';

@Component({
  selector: 'app-referral-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MainLayoutComponent,
    EmrTabsComponent
  ],
  templateUrl: './referral.page.html',
  styleUrl: './referral.page.css'
})
export class ReferralPageComponent implements OnInit {

  referralForm!: FormGroup;

  referrals: Referral[] = [];

  isEditMode = false;

  selectedReferralId: number | null = null;

  loading = false;

  searchId = '';
  private toastService = inject(ToastService);

  constructor(
    private fb: FormBuilder,
    private referralService: ReferralService
  ) {}

  ngOnInit(): void {

    this.initializeForm();

    this.loadReferrals();

  }

  private initializeForm(): void {

    this.referralForm = this.fb.group({

      consultationID: ['', Validators.required],

      referredToDepartment: ['', Validators.required],

      reason: ['', Validators.required],

      priority: ['Routine'],

      status: ['Pending']

    });

  }

  loadReferrals(): void {

    this.loading = true;

    this.referralService
      .getAllReferrals()
      .subscribe({

        next: (data: Referral[]) => {

          this.referrals = data;

          this.loading = false;

        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;

        }

      });

  }

  saveReferral(): void {

    if (this.referralForm.invalid) {
      return;
    }

    const referral: Referral =
      this.referralForm.value;

    if (
      this.isEditMode &&
      this.selectedReferralId
    ) {

      this.referralService
        .updateReferral(
          this.selectedReferralId,
          referral
        )
        .subscribe({

          next: () => {
            this.toastService.showToast('success', 'Referral Updated', 'Referral Updated Successfully');
            this.resetForm();
            this.loadReferrals();
          },
          error: (err: any) => {
            console.error(err);
            this.toastService.showToast('error', 'Update Failed', 'Could not update referral.');
          }

        });

    } else {

      this.referralService
        .createReferral(referral)
        .subscribe({

          next: () => {
            this.toastService.showToast('success', 'Referral Created', 'Referral Created Successfully');
            this.resetForm();
            this.loadReferrals();
          },
          error: (err: any) => {
            console.error(err);
            this.toastService.showToast('error', 'Creation Failed', 'Could not create referral.');
          }

        });

    }

  }

  editReferral(referral: Referral): void {

    this.isEditMode = true;

    this.selectedReferralId =
      referral.referralId ?? null;

    this.referralForm.patchValue({

      consultationID:
        referral.consultationID,

      referredToDepartment:
        referral.referredToDepartment,

      reason:
        referral.reason,

      priority:
        referral.priority,

      status:
        referral.status

    });

  }

  deleteReferral(id: number): void {

    if (!confirm('Delete referral?')) {
      return;
    }

    this.referralService
      .deleteReferral(id)
      .subscribe({

        next: () => {
          this.toastService.showToast('success', 'Referral Deleted', 'Referral Deleted Successfully');
          this.loadReferrals();
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.showToast('error', 'Delete Failed', 'Could not delete referral.');
        }

      });

  }

  searchReferral(): void {

    if (
      this.searchId.trim() === ''
    ) {

      this.loadReferrals();

      return;

    }

    this.referralService
      .getReferralById(
        Number(this.searchId)
      )
      .subscribe({

        next: (response: Referral) => {

          this.referrals = [
            response
          ];

        },

        error: (err: any) => {
          console.error(err);
          this.toastService.showToast('error', 'Not Found', 'Referral Not Found');
        }

      });

  }

  refreshReferrals(): void {

    this.searchId = '';

    this.loadReferrals();

  }

  private resetForm(): void {

    this.referralForm.reset({

      priority: 'Routine',

      status: 'Pending'

    });

    this.isEditMode = false;

    this.selectedReferralId = null;

  }

}