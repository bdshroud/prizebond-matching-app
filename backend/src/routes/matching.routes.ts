import { Router } from 'express';
import { matchingController } from '../controllers/matching.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public instant checker endpoint
router.post('/check', matchingController.checkBondsInstant);

// Authenticated user match history endpoints
router.use(authenticate);

router.get('/history', matchingController.getMatchHistory);
router.get('/history/:id', matchingController.getMatchById);

export default router;
