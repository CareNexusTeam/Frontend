import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { EmrTabsComponent }from '../components/emr-tabs';

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
export class ReferralPageComponent {

  referralForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {

    this.referralForm = this.fb.group({

      consultationId: [''],

      referredDepartment: [''],

      reason: [''],

      priority: ['Routine'],

      status: ['Pending']

    });

  }

  saveReferral(): void {

    console.log(
      this.referralForm.value
    );

  }

}