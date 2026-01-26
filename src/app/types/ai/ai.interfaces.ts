// Chat interfaces
export interface ChatInterface {
  id: string;
  title: string;
  isArchived: boolean;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatListResponse {
  chats: ChatInterface[];
  total: number;
}

export interface CreateChatRequest {
  title?: string;
}

// Message interfaces
export interface MessageInterface {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tokensInput?: number;
  tokensOutput?: number;
  model?: string;
  attachments?: AttachmentInterface[];
  createdAt: string;
}

export interface AttachmentInterface {
  type: 'document' | 'case';
  id: string;
  name: string;
  cachedLength?: number;
}

export interface ChatWithMessagesResponse {
  chat: ChatInterface;
  messages: MessageInterface[];
}

export interface SendMessageRequest {
  content: string;
  documentIds?: string[];
  caseIds?: string[];
}

// Quick chat interfaces
export interface QuickChatRequest {
  message: string;
}

export interface QuickChatResponse {
  response: string;
  tokensInput: number;
  tokensOutput: number;
  model: string;
}

// Document analysis interfaces
export interface AnalyzeDocumentRequest {
  analysisType: 'overview' | 'risks' | 'summary' | 'full';
}

export interface DocumentAnalysisResponse {
  id: string;
  documentId: string;
  versionId: string;
  analysisType: string;
  content: string;
  tokensUsed: number;
  model: string;
  createdAt: string;
}

// Token interfaces
export interface TokenBalanceResponse {
  // Monthly limits
  monthlyLimit: number;
  monthlyUsed: number;
  monthlyRemaining: number;
  monthlyResetsAt: string;

  // Daily limits
  dailyLimit: number;
  dailyUsed: number;
  dailyRemaining: number;
  dailyResetsAt: string;

  // Weekly limits
  weeklyLimit: number;
  weeklyUsed: number;
  weeklyRemaining: number;
  weeklyResetsAt: string;

  // Purchased tokens (bypass daily/weekly limits)
  purchasedTokens: number;

  // Totals
  totalAvailable: number;
  usagePercentage: number;

  // Current limit status
  limitStatus:
    | 'ok'
    | 'daily_warning'
    | 'weekly_warning'
    | 'monthly_warning'
    | 'daily_reached'
    | 'weekly_reached'
    | 'monthly_reached';
}

export interface TokenPackInterface {
  type: 'starter' | 'standard' | 'large';
  tokens: number;
  price: number;
  currency: string;
  pricePerMillion: number;
}

export interface TokenPacksResponse {
  packs: TokenPackInterface[];
}

export interface TokenUsageInterface {
  id: string;
  operation: string;
  tokensInput: number;
  tokensOutput: number;
  tokensTotal: number;
  source: string;
  model: string;
  referenceType?: string;
  createdAt: string;
}

export interface TokenUsageListResponse {
  usage: TokenUsageInterface[];
  total: number;
}

// Insights interfaces
export interface InsightInterface {
  id: string;
  type: 'insight' | 'trend' | 'tip' | 'pattern';
  title: string;
  content: string;
  basedOn: string;
  createdAt: string;
  expiresAt: string;
}

export interface InsightsListResponse {
  insights: InsightInterface[];
  updatedAt?: string;
}
