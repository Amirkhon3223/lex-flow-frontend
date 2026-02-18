export type TrustAccountStatus = 'active' | 'frozen' | 'closed';
export type TrustTransactionType = 'deposit' | 'withdrawal' | 'interest' | 'fee_deduction' | 'refund' | 'transfer';

export interface TrustAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  totalBalance: number;
  status: TrustAccountStatus;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrustAccountRequest {
  name: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  notes?: string;
}

export interface UpdateTrustAccountRequest {
  name?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  status?: string;
  notes?: string;
}

export interface TrustTransaction {
  id: string;
  trustAccountId: string;
  clientId: string;
  clientName: string;
  caseId: string;
  caseName: string;
  type: TrustTransactionType;
  amount: number;
  runningBalance: number;
  description: string;
  reference: string;
  transactionDate: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateTrustTransactionRequest {
  trustAccountId: string;
  clientId: string;
  caseId?: string;
  type: string;
  amount: number;
  description: string;
  reference?: string;
  transactionDate: string;
}

export interface TrustSummary {
  accounts: TrustSummaryAccount[];
  total: number;
}

export interface TrustSummaryAccount {
  accountId: string;
  accountName: string;
  totalBalance: number;
  clientCount: number;
}

export interface ClientBalance {
  clientId: string;
  balance: number;
}
