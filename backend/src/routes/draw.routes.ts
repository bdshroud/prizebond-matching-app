import { Router } from 'express';
import multer from 'multer';
import { drawController } from '../controllers/draw.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createDrawSchema,
  updateDrawSchema,
  addWinningNumbersSchema,
  getDrawsQuerySchema
} from '../validators/draw.validator.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const router = Router();

// Public / User routes (Optional auth for checking admin privileges)
router.get('/', validate(getDrawsQuerySchema), drawController.getDraws);
router.get('/:id', drawController.getDrawById);

// Admin-only routes
router.use(authenticate, requireAdmin);

router.post('/', validate(createDrawSchema), drawController.createDraw);
router.put('/:id', validate(updateDrawSchema), drawController.updateDraw);
router.delete('/:id', drawController.deleteDraw);
router.post('/:id/winning-numbers', validate(addWinningNumbersSchema), drawController.addWinningNumbers);
router.post('/:id/winning-numbers-csv', upload.single('file'), drawController.importWinningNumbersCSV);
router.post('/:id/publish', drawController.publishDraw);
router.post('/:id/trigger-match', drawController.triggerMatchManually);

export default router;
