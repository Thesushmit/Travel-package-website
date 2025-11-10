import { Router } from 'express';
import {
  getPackages,
  getAllTags,
  getPackageBySlug,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  seedPackages
} from '../controllers/packageController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getPackages);
router.get('/tags', getAllTags);
router.get('/slug/:slug', getPackageBySlug);
router.get('/:id', getPackageById);

// Seed (dev convenience)
if (process.env.NODE_ENV !== 'production') {
  router.post('/seed', seedPackages);
}

router.post('/', protect, adminOnly, createPackage);
router.patch('/:id', protect, adminOnly, updatePackage);
router.delete('/:id', protect, adminOnly, deletePackage);

export default router;
