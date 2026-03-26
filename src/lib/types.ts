export type Priority = "high" | "medium" | "low";
export type MessageSource = "gmail" | "slack";

export interface UnifiedMessage {
  id: string;
  source: MessageSource;
  from: string;
  fromEmail?: string;
  subject: string;
  body: string;
  snippet: string;
  receivedAt: string;
  threadId?: string;
  channelName?: string;
  priority?: Priority;
  priorityReason?: string;
  aiSummary?: string;
  isRead: boolean;
  isArchived: boolean;
}

export interface DraftResponse {
  draft: string;
  tone: "casual" | "business" | "formal";
}

export interface PrioritizeResponse {
  messages: Array<{
    id: string;
    priority: Priority;
    reason: string;
    summary: string;
  }>;
}
