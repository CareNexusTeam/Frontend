export interface Dispensation {
  dispensationID?: number;
  drugId: number;
  drugName?: string;
  prescriptionId: number;
  quantityDispensed?: number;
  dispensedById: number;
  dispensationDate?: string;
  status?: 'Dispensed' | 'Partial' | 'Pending';
}