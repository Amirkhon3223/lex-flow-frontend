import { CaseStatusEnum, CasePriorityEnum } from './cases.enums';

export interface ClientInfoInterface {
  name: string;
  avatar: string;
}

export interface CaseInterface {
  id: number;
  title: string;
  client: ClientInfoInterface;
  category: string;
  status: CaseStatusEnum;
  priority: CasePriorityEnum;
  deadline: string;
  progress: number;
  documents: number;
  createdAt: string;
  lastUpdate: string;
}
