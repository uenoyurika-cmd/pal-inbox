import { create } from "zustand";
import { UnifiedMessage, Priority, PrioritizeResponse } from "./types";

interface StoreState {
  messages: UnifiedMessage[];
  selectedMessageId: string | null;
  activeTab: "inbox" | "archived" | "stats";
  filter: "all" | "gmail" | "slack";
  isLoading: boolean;
  draft: string | null;
  isDraftLoading: boolean;
  archivedToday: number;

  // Actions
  setMessages: (messages: UnifiedMessage[]) => void;
  selectMessage: (id: string | null) => void;
  setActiveTab: (tab: "inbox" | "archived" | "stats") => void;
  setFilter: (filter: "all" | "gmail" | "slack") => void;
  setLoading: (loading: boolean) => void;
  archiveMessage: (id: string) => void;
  setDraft: (draft: string | null) => void;
  setDraftLoading: (loading: boolean) => void;
  incrementArchived: () => void;
  fetchMessages: () => Promise<void>;
  generateDraft: (messageId: string) => Promise<void>;
  prioritizeMessages: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  messages: [],
  selectedMessageId: null,
  activeTab: "inbox",
  filter: "all",
  isLoading: false,
  draft: null,
  isDraftLoading: false,
  archivedToday: 0,

  setMessages: (messages) => set({ messages }),

  selectMessage: (id) => set({ selectedMessageId: id }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setFilter: (filter) => set({ filter }),

  setLoading: (loading) => set({ isLoading: loading }),

  setDraft: (draft) => set({ draft }),

  setDraftLoading: (loading) => set({ isDraftLoading: loading }),

  incrementArchived: () =>
    set((state) => ({ archivedToday: state.archivedToday + 1 })),

  archiveMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })),

  fetchMessages: async () => {
    const { setLoading, setMessages } = get();
    setLoading(true);
    try {
      const [gmailRes, slackRes] = await Promise.all([
        fetch("/api/gmail/messages"),
        fetch("/api/slack/messages"),
      ]);

      const gmailMessages: UnifiedMessage[] = gmailRes.ok ? await gmailRes.json() : [];
      const slackMessages: UnifiedMessage[] = slackRes.ok ? await slackRes.json() : [];

      const allMessages = [...gmailMessages, ...slackMessages];
      setMessages(allMessages);

      // Prioritize after fetching
      await get().prioritizeMessages();
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  },

  generateDraft: async (messageId) => {
    const { messages, setDraft, setDraftLoading } = get();
    const message = messages.find((m) => m.id === messageId);

    if (!message) return;

    setDraftLoading(true);
    try {
      const res = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: message.subject,
          body: message.body,
          from: message.from,
          source: message.source,
          tone: "business",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDraft(data.draft);
      }
    } catch (error) {
      console.error("Error generating draft:", error);
    } finally {
      setDraftLoading(false);
    }
  },

  prioritizeMessages: async () => {
    const { messages, setMessages } = get();

    if (messages.length === 0) return;

    try {
      const messagesToPrioritize = messages.map((m) => ({
        id: m.id,
        from: m.from,
        subject: m.subject,
        snippet: m.snippet,
        receivedAt: m.receivedAt,
      }));

      const res = await fetch("/api/ai/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesToPrioritize }),
      });

      if (res.ok) {
        const prioritized: PrioritizeResponse = await res.json();

        const updatedMessages = messages.map((m) => {
          const priorityData = prioritized.messages.find((p) => p.id === m.id);
          return {
            ...m,
            priority: priorityData?.priority as Priority,
            priorityReason: priorityData?.reason,
            aiSummary: priorityData?.summary,
          };
        });

        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error("Error prioritizing messages:", error);
    }
  },
}));
