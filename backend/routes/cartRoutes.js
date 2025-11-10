import { Router } from 'express';
import {
  getCart,
  upsertCartItem,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getCart);
router.post('/', upsertCartItem);
router.patch('/:id', updateCartItem);
router.delete('/:id', removeCartItem);
router.delete('/', clearCart);

export default router;
