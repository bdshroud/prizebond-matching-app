import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', adminController.getSystemStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.get('/jobs', adminController.getJobs);
router.post('/jobs/run-matcher', adminController.runMatchingJob);
router.get('/email-logs', adminController.getEmailLogs);
router.post('/email-logs/:id/retry', adminController.retryFailedEmail);
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
