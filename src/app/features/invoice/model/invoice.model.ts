export interface Invoice {
  invoiceID?: number;
  patientId: number;
  patientName?: string;
  consultationId: number;
  totalAmount?: number;
  paidAmount: number;
  outstandingAmount?: number;
  invoiceDate?: string;
  status?: 'Pending' | 'PartiallyPaid' | 'Paid' | 'Cancelled';
}