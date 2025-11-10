# Backend - Travel Package Website

This backend is a Node.js + Express REST API that powers the Travel Package Website. It uses MongoDB (via Mongoose) for persistence, JSON Web Tokens for authentication, and follows a modular controller/route architecture.

## Structure

```
backend/
├── config/
│   └── db.js                # MongoDB connection helper
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── cartController.js
│   ├── packageController.js
│   └── wishlistController.js
├── middleware/
│   └── authMiddleware.js    # JWT verification
├── models/
│   ├── Booking.js
│   ├── CartItem.js
│   ├── TravelPackage.js
│   ├── User.js
│   └── WishlistItem.js
├── routes/
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── cartRoutes.js
│   ├── packageRoutes.js
│   └── wishlistRoutes.js
├── utils/
│   └── generateToken.js     # JWT helpers
├── server.js                # Express entry point
└── package.json
```

## Setup

1. Create `.env` in `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/travelDB
JWT_SECRET=super_secret_key_change_me
JWT_EXPIRES_IN=7d
JWT_COOKIE_MAX_AGE=604800000
CLIENT_ORIGIN=http://localhost:5173
```

2. Install dependencies and start the dev server:

```bash
cd backend
npm install
npm run dev
```

The API will start on `http://localhost:5000` and connect to the MongoDB instance specified by `MONGODB_URI`.

## Available Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user and return JWT |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current user profile |
| PATCH | `/api/auth/me` | Update current user profile |
| GET | `/api/packages` | List travel packages with filtering |
| GET | `/api/packages/slug/:slug` | Retrieve package by slug |
| POST | `/api/packages` | Create package (admin) |
| GET | `/api/bookings` | List bookings for current user |
| POST | `/api/bookings` | Create booking |
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add/update cart item |
| DELETE | `/api/cart/:id` | Remove cart item |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist` | Add to wishlist |
| DELETE | `/api/wishlist/:id` | Remove from wishlist |

All protected routes require a valid `Authorization: Bearer <token>` header. Tokens are issued during login/registration.

