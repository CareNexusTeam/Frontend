export interface InsuranceClaim {
  claimID?: number;
  invoiceId: number;
  insuranceProviderId: number;
  claimAmount: number;
  submissionDate?: string;
  status?: 'Pending' | 'Submitted' | 'Approved' | 'Rejected' | 'Settled';
}