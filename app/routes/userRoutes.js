import express from 'express';

import {createUser,siginUser} from '../controllers/userController.js';

const router = express.Router();

// user Routes
router.post('/signup',createUser);
router.post('/signin',siginUser);

export default router;