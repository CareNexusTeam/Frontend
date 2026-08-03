import { Component, OnInit, inject } from '@angular/core';
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

  private fb = inject(FormBuilder);
  private drugService = inject(DrugInventoryService);

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

  // Toast Notification State
  showToast = false;
  toastType: 'success' | 'error' | 'info' = 'success';
  toastTitle = '';
  toastMessage = '';
  private toastTimeout: any;

  ngOnInit(): void {
    this.loadDrugs();
  }

  loadDrugs(): void {
    this.loading = true;
    this.drugService.getAllDrugs().subscribe({
      next: (data) => {
        this.drugs = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.triggerToast('error', 'Error', 'Failed to load drug inventory.');
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
        this.triggerToast('success', 'Drug Added', 'New drug has been successfully added to inventory.');
      },
      error: (error) => {
        console.error('Error adding drug', error);
        this.triggerToast('error', 'Action Failed', 'Could not add drug. Please try again.');
      }
    });
  }

  searchDrugs(): void {
    if (!this.searchKeyword.trim()) { this.loadDrugs(); return; }
    this.drugService.searchDrugs(this.searchKeyword).subscribe({
      next: (data) => { 
        this.drugs = data; 
        this.loading = false;
        this.triggerToast('info', 'Search Results', `Found ${data.length} drug(s) matching "${this.searchKeyword}".`);
      },
      error: (error) => { 
        console.error('Error searching drugs', error); 
        this.loading = false; 
        this.triggerToast('error', 'Search Failed', 'Failed to fetch search results.');
      }
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
      next: (data) => { 
        this.drugs = data; 
        this.loading = false;
        this.triggerToast('info', 'Filter Applied', `Showing ${data.length} low stock item(s).`);
      },
      error: (error) => { console.error('Error loading low stock', error); this.loading = false; }
    });
  }

  showExpiring(): void {
    this.drugService.getExpiringDrugs().subscribe({
      next: (data) => { 
        this.drugs = data; 
        this.loading = false;
        this.triggerToast('info', 'Filter Applied', `Showing ${data.length} drug(s) expiring soon.`);
      },
      error: (error) => { console.error('Error loading expiring drugs', error); this.loading = false; }
    });
  }

  showAll(): void {
    this.loadDrugs();
    this.triggerToast('info', 'Inventory Refreshed', 'Showing all drugs in system.');
  }

  updateStock(drugId: number): void {
    const quantity = this.stockInputs[drugId];
    if (!quantity) return;
    this.drugService.updateStock(drugId, quantity).subscribe({
      next: () => { 
        this.stockInputs[drugId] = 0; 
        this.loadDrugs(); 
        this.triggerToast('success', 'Stock Updated', 'Inventory stock quantity updated successfully.');
      },
      error: (error) => {
        console.error('Error updating stock', error);
        this.triggerToast('error', 'Update Failed', 'Unable to update stock quantity.');
      }
    });
  }

  updateStatus(drugId: number, status: string): void {
    if (!status) return;
    this.drugService.updateStatus(drugId, status).subscribe({
      next: () => {
        this.loadDrugs();
        this.triggerToast('success', 'Status Updated', `Drug status changed to ${status}.`);
      },
      error: (error) => {
        console.error('Error updating status', error);
        this.triggerToast('error', 'Update Failed', 'Could not update drug status.');
      }
    });
  }

  deleteDrug(drugId: number): void {
    this.drugService.deleteDrug(drugId).subscribe({
      next: () => {
        this.loadDrugs();
        this.triggerToast('success', 'Drug Deleted', 'Record removed from inventory.');
      },
      error: (error) => {
        console.error('Error deleting drug', error);
        this.triggerToast('error', 'Delete Failed', 'Failed to delete the drug record.');
      }
    });
  }

  // Toast Handler
  triggerToast(type: 'success' | 'error' | 'info', title: string, message: string): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastType = type;
    this.toastTitle = title;
    this.toastMessage = message;
    this.showToast = true;

    this.toastTimeout = setTimeout(() => {
      this.closeToast();
    }, 5000);
  }

  closeToast(): void {
    this.showToast = false;
  }
}