export interface SubscriptionFeatures {
  clients: string;
  cases: string;
  storage: string;
  users: number;
}

export interface Payment {
  date: string;
  plan: string;
  amount: string;
}

export interface SubscriptionTabProps {
  plan: string;
  price: string;
  period: string;
  expiresAt: string;
  status: string;
  features: SubscriptionFeatures;
  payments: Payment[];
}
