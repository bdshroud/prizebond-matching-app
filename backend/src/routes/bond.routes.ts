import { Router } from 'express';
import multer from 'multer';
import { bondController } from '../controllers/bond.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  addBondSchema,
  bulkAddBondsSchema,
  updateBondSchema,
  getBondsQuerySchema
} from '../validators/bond.validator.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = Router();

router.use(authenticate); // All bond routes require authentication

router.get('/', validate(getBondsQuerySchema), bondController.getBonds);
router.get('/export-csv', bondController.exportCSV);
router.post('/import-csv', upload.single('file'), bondController.importCSV);
router.get('/:id', bondController.getBondById);
router.post('/', validate(addBondSchema), bondController.addBond);
router.post('/bulk', validate(bulkAddBondsSchema), bondController.bulkAddBonds);
router.put('/:id', validate(updateBondSchema), bondController.updateBond);
router.delete('/:id', bondController.deleteBond);
router.delete('/', bondController.deleteBonds);

export default router;
