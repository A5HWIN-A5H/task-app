import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { getSystemStats, getAllUsers, toggleUserStatus } from '../controllers/admin.controller';

const router = Router();

router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);

export default router;