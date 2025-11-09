# Backend - Travel Package Website

This backend uses **Supabase** as the backend-as-a-service platform, providing:
- PostgreSQL database
- Authentication (JWT-based)
- Row Level Security (RLS)
- Real-time subscriptions
- Storage

## Structure

```
backend/
├── config/
│   └── db.js                # Supabase client configuration
├── models/
│   └── User.js              # User model and database operations
├── routes/
│   └── authRoutes.js        # Authentication routes (documentation)
├── controllers/
│   └── authController.js    # Authentication business logic (documentation)
├── middleware/
│   └── authMiddleware.js    # Auth middleware (documentation)
├── utils/
│   └── generateToken.js     # Token utilities (documentation)
├── supabase/
│   ├── config.toml         # Supabase project config
│   └── migrations/          # Database migrations
└── scripts/
    ├── add-sample-packages.ts
    └── check-supabase-connection.ts
```

## Setup

1. Create `.env` file in `backend/` directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional)
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Run database migrations in Supabase SQL Editor

4. Add sample packages:
```bash
npm run add-packages
```

## Database Schema

- `profiles` - User profiles
- `user_roles` - User roles (admin/user)
- `travel_packages` - Travel package listings
- `bookings` - User bookings
- `wishlist` - User wishlist items
- `cart` - User shopping cart items

## Authentication

Authentication is handled by Supabase Auth on the frontend. The backend files in `routes/`, `controllers/`, and `middleware/` are for documentation purposes, as Supabase handles these operations automatically.

