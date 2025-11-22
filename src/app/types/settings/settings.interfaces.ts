
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

export interface NotificationSettingInterface {
  label: string;
  description: string;
  checked: boolean;
}

export interface SessionInterface {
  device: string;
  location: string;
  current: boolean;
  time: string;
}

export interface TeamMemberInterface {
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'assistant';
  status: string;
}

export interface PaymentHistoryInterface {
  date: string;
  amount: string;
  status: string;
  invoice: string;
}


export interface NotificationToggleItemProps {
  setting: NotificationSettingInterface;
  onToggle?: (checked: boolean) => void;
}

export interface SessionItemProps {
  session: SessionInterface;
  onTerminate?: () => void;
}

export interface TeamMemberItemProps {
  member: TeamMemberInterface;
  onSettings?: () => void;
}

export interface PaymentHistoryItemProps {
  payment: PaymentHistoryInterface;
  onDownload?: () => void;
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
