import express from 'express';

import { addTopic,getAllTopics } from '../controllers/topicController.js';

import verifyAuth from '../middlewares/verifyAuth.js';

const router = express.Router();

// topic Routes

router.post('/add', verifyAuth, addTopic);
router.get('/get', verifyAuth, getAllTopics);

export default router;