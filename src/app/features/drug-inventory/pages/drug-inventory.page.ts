import { Component, OnInit ,inject} from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout';
import { DrugInventoryService } from '../services/drug-inventory.service';
import { Drug } from '../model/drug-inventory.model';

@Component({
  selector: 'app-drug-inventory-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MainLayoutComponent],
  templateUrl: './drug-inventory.page.html'
})
export class DrugInventoryPageComponent implements OnInit {

  private fb=inject(FormBuilder);
  private drugService=inject(DrugInventoryService);

  drugs: Drug[] = [];
  loading = false;

  drugForm = this.fb.group({
    drugName: [''],
    category: [''],
    quantityInStock: [0],
    reorderLevel: [50],
    pricePerUnit: [0],
    expiryDate: [''],
    status: ['Available']
  });

  searchKeyword = '';
  filterCategory = '';
  filterStatus = '';
  stockInputs: { [drugId: number]: number } = {};




  ngOnInit(): void {
    this.loadDrugs();
  }

  loadDrugs(): void {
  //this.loading = true;
  //console.log('Before API:', this.loading);

  this.drugService.getAllDrugs().subscribe({
    next: (data) => {
      //console.log('API returned');
      this.drugs = data;
      this.loading = false;
     // console.log('After API:', this.loading);
    },
    error: (error) => {
      console.error(error);
      this.loading = false;
    }
  });
}

  addDrug(): void {
    if (this.drugForm.invalid) return;
    const payload = this.drugForm.value as unknown as Drug;

    this.drugService.addDrug(payload).subscribe({
      next: () => {
        this.loadDrugs();
        this.drugForm.reset({ status: 'Available', reorderLevel: 50, quantityInStock: 0, pricePerUnit: 0 });
      },
      error: (error) => console.error('Error adding drug', error)
    });
  }

  searchDrugs(): void {
    if (!this.searchKeyword.trim()) { this.loadDrugs(); return; }
    this.drugService.searchDrugs(this.searchKeyword).subscribe({
      next: (data) => { this.drugs = data; this.loading = false; },
      error: (error) => { console.error('Error searching drugs', error); this.loading = false; }
    });
  }

  applyFilter(): void {
    if (!this.filterCategory && !this.filterStatus) { this.loadDrugs(); return; }
    this.drugService.filterDrugs(this.filterCategory, this.filterStatus).subscribe({
      next: (data) => { this.drugs = data; this.loading = false; },
      error: (error) => { console.error('Error filtering drugs', error); this.loading = false; }
    });
  }

  showLowStock(): void {
    this.drugService.getLowStock().subscribe({
      next: (data) => { this.drugs = data; this.loading = false; },
      error: (error) => { console.error('Error loading low stock', error); this.loading = false; }
    });
  }

  showExpiring(): void {
    this.drugService.getExpiringDrugs().subscribe({
      next: (data) => { this.drugs = data; this.loading = false; },
      error: (error) => { console.error('Error loading expiring drugs', error); this.loading = false; }
    });
  }

  showAll(): void {

    this.loadDrugs();
  }

  updateStock(drugId: number): void {
    const quantity = this.stockInputs[drugId];
    if (!quantity) return;
    this.drugService.updateStock(drugId, quantity).subscribe({
      next: () => { this.stockInputs[drugId] = 0; this.loadDrugs(); },
      error: (error) => console.error('Error updating stock', error)
    });
  }

  updateStatus(drugId: number, status: string): void {
    this.drugService.updateStatus(drugId, status).subscribe({
      next: () => this.loadDrugs(),
      error: (error) => console.error('Error updating status', error)
    });
  }

  deleteDrug(drugId: number): void {
    this.drugService.deleteDrug(drugId).subscribe({
      next: () => this.loadDrugs(),
      error: (error) => console.error('Error deleting drug', error)
    });
  }
}
