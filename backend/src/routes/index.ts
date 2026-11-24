import { Router } from 'express';
import authRoutes from './auth.routes.js';
import bondRoutes from './bond.routes.js';
import drawRoutes from './draw.routes.js';
import matchingRoutes from './matching.routes.js';
import notificationRoutes from './notification.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Bangladesh Prize Bond Monitoring Platform API'
  });
});

router.use('/auth', authRoutes);
router.use('/bonds', bondRoutes);
router.use('/draws', drawRoutes);
router.use('/matching', matchingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);

export default router;
