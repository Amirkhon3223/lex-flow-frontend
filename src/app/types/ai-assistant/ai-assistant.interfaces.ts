import { MessageTypeEnum, AnalysisStatusEnum, InsightTypeEnum } from './ai-assistant.enums';

export interface InsightInterface {
  type: InsightTypeEnum;
  text: string;
}

export interface ChatMessageInterface {
  type: MessageTypeEnum;
  message: string;
  time: string;
  insights?: InsightInterface[];
}

export interface RecentAnalysisInterface {
  document: string;
  case: string;
  result: string;
  status: AnalysisStatusEnum;
  date: string;
}
