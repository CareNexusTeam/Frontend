import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { EmrTabsComponent } from '../components/emr-tabs';

import { ReferralService } from '../referral/services/referral.service';
import { Referral } from '../referral/models/referral.model';

@Component({
  selector: 'app-referral-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainLayoutComponent,
    EmrTabsComponent
  ],
  templateUrl: './referral.page.html'
})
export class ReferralPageComponent implements OnInit {

  referralForm!: FormGroup;

  referrals: Referral[] = [];

  isEditMode = false;

  selectedReferralId: number | null = null;

  loading = false;

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

    const referral: Referral = this.referralForm.value;

    if (this.isEditMode && this.selectedReferralId) {

      this.referralService
        .updateReferral(
          this.selectedReferralId,
          referral
        )
        .subscribe({

          next: () => {

            this.resetForm();

            this.loadReferrals();

          },

          error: (err: any) => console.error(err)

        });

    } else {

      this.referralService
        .createReferral(referral)
        .subscribe({

          next: () => {

            this.resetForm();

            this.loadReferrals();

          },

          error: (err: any) => console.error(err)

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

          this.loadReferrals();

        },

        error: (err: any) =>
          console.error(err)

      });

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
