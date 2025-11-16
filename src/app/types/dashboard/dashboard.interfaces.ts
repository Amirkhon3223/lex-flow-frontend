export interface CaseItemProps {
  id: number;
  title: string;
  client: string;
  deadline: string;
  status?: 'urgent' | 'completed' | 'medium';
  onClick?: () => void;
}

export interface ActivityItemProps {
  action: string;
  item: string;
  client: string;
  time: string;
  isLast?: boolean;
}

export interface PriorityCaseInterface {
  id: number;
  title: string;
  client: string;
  deadline: string;
  progress: number;
  status: 'urgent' | 'medium' | 'completed';
}

export interface UpcomingEventInterface {
  time: string;
  title: string;
}

export interface RecentActivityInterface {
  action: string;
  item: string;
  client: string;
  time: string;
}
