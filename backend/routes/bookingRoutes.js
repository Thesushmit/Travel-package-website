import { Router } from 'express';
import { getBookings, createBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getBookings);
router.post('/', createBooking);

export default router;
