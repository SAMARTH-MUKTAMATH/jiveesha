import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create conversation and send first message
 * POST /api/v1/messages/conversations
 */
export const createConversation = async (req: Request, res: Response) => {
    try {
        const senderId = (req as any).userId;
        const {
            recipientId,
            recipientType,
            personId,
            subject,
            body,
            senderName,
            recipientName
        } = req.body;

        const conversation = await prisma.conversation.create({
            data: {
                participants: JSON.stringify([
                    { id: senderId, type: 'clinician', name: senderName },
                    { id: recipientId, type: recipientType, name: recipientName }
                ]),
                personId,
                subject,
                lastMessageAt: new Date(),
                messages: {
                    create: {
                        senderId,
                        senderType: 'clinician',
                        senderName,
                        recipientId,
                        recipientType,
                        body
                    }
                }
            },
            include: {
                messages: true
            }
        });

        // Create notification for recipient
        await prisma.notification.create({
            data: {
                userId: recipientId,
                userType: recipientType,
                notificationType: 'message_received',
                title: 'New Message',
                message: `${senderName} sent you a message`,
                actionUrl: `/messages/${conversation.id}`,
                actionData: JSON.stringify({ conversationId: conversation.id }),
                category: 'messages'
            }
        });

        res.status(201).json({
            success: true,
            data: conversation
        });
    } catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'CREATE_CONVERSATION_FAILED',
                message: 'Failed to create conversation'
            }
        });
    }
};

/**
 * Send message in existing conversation
 * POST /api/v1/messages/:conversationId
 */
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const senderId = (req as any).userId;
        const {
            recipientId,
            recipientType,
            senderName,
            senderType,
            body,
            attachments
        } = req.body;

        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId,
                senderType: senderType || 'clinician',
                senderName,
                recipientId,
                recipientType,
                body,
                attachments
            }
        });

        // Update conversation last message time
        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessageAt: new Date()
            }
        });

        // Create notification
        await prisma.notification.create({
            data: {
                userId: recipientId,
                userType: recipientType,
                notificationType: 'message_received',
                title: 'New Message',
                message: `${senderName} sent you a message`,
                actionUrl: `/messages/${conversationId}`,
                actionData: JSON.stringify({ conversationId, messageId: message.id }),
                category: 'messages'
            }
        });

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SEND_MESSAGE_FAILED',
                message: 'Failed to send message'
            }
        });
    }
};

/**
 * Get conversation by ID
 * GET /api/v1/messages/:conversationId
 */
export const getConversation = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: {
                    orderBy: { sentAt: 'asc' }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'CONVERSATION_NOT_FOUND',
                    message: 'Conversation not found'
                }
            });
        }

        res.json({
            success: true,
            data: conversation
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_CONVERSATION_FAILED',
                message: 'Failed to retrieve conversation'
            }
        });
    }
};

/**
 * Get all conversations for user
 * GET /api/v1/messages/conversations/my
 */
export const getMyConversations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        // For SQLite, we need to fetch all and filter in memory
        const allConversations = await prisma.conversation.findMany({
            include: {
                messages: {
                    orderBy: { sentAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { lastMessageAt: 'desc' }
        });

        // Filter conversations where user is a participant
        const conversations = allConversations.filter(conv => {
            const participants = conv.participants ? JSON.parse(conv.participants as string) : [];
            return participants.some((p: any) => p.id === userId);
        });

        res.json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_CONVERSATIONS_FAILED',
                message: 'Failed to retrieve conversations'
            }
        });
    }
};

/**
 * Mark message as read
 * PUT /api/v1/messages/:messageId/read
 */
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.params;

        const message = await prisma.message.update({
            where: { id: messageId },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });

        res.json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'MARK_READ_FAILED',
                message: 'Failed to mark message as read'
            }
        });
    }
};

/**
 * Get unread message count
 * GET /api/v1/messages/unread/count
 */
export const getUnreadCount = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const count = await prisma.message.count({
            where: {
                recipientId: userId,
                isRead: false
            }
        });

        res.json({
            success: true,
            data: { count }
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_UNREAD_COUNT_FAILED',
                message: 'Failed to get unread count'
            }
        });
    }
};
