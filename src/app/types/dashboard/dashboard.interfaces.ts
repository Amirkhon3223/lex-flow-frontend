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
