import express from 'express';
import {
    createConversation,
    sendMessage,
    getConversation,
    getMyConversations,
    markAsRead,
    getUnreadCount
} from '../controllers/messages.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/conversations', createConversation);
router.get('/conversations/my', getMyConversations);
router.get('/unread/count', getUnreadCount);
router.get('/:conversationId', getConversation);
router.post('/:conversationId', sendMessage);
router.put('/:messageId/read', markAsRead);

export default router;
