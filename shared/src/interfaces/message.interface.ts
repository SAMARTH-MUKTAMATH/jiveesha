export interface Conversation {
    id: string;
    participants: Array<{ id: string; type: string; name: string; avatar?: string }>;
    patientId?: string;
    subject?: string;
    lastMessageAt?: string;
    createdAt: string;

    // Populated relations
    messages?: Message[];
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderType: string;
    senderName: string;
    recipientId: string;
    recipientType: string;
    body: string;
    attachments: Array<{ url: string; type: string; name: string }>;
    isRead: boolean;
    readAt?: string;
    sentAt: string;
}

export interface CreateConversationData {
    participants: Array<{ id: string; type: string; name: string; avatar?: string }>;
    patientId?: string;
    subject?: string;
    initialMessage: string;
}

export interface SendMessageData {
    body: string;
    attachments?: Array<{ url: string; type: string; name: string }>;
}

export interface ConversationWithDetails extends Conversation {
    unreadCount?: number;
    lastMessage?: Message;
}

export interface MessageFilters {
    conversationId?: string;
    isRead?: boolean;
    startDate?: string;
    endDate?: string;
}
