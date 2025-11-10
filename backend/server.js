import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import TravelPackage from './models/TravelPackage.js';
import { seedPackages } from './controllers/packageController.js';

dotenv.config();

const app = express();

// Database connection
connectDB();

// Dev auto-seed
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    try {
      const count = await TravelPackage.countDocuments();
      if (count === 0) {
        // @ts-ignore - using controller fn directly
        await seedPackages({}, { status: () => ({ json: () => null }) });
        console.log('🌱 Sample packages seeded');
      }
    } catch (e) {
      console.warn('Seed skipped:', e?.message || e);
    }
  })();
}

// Middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: true, credentials: true }));
} else {
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || 'http://localhost:8080',
    credentials: true
  }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
