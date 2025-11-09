# Wanderlust Hub - Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account and project

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the Supabase dashboard
3. Create a `.env` file in the `backend/` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional)
```

4. Create a `.env` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 3. Run Database Migrations

The database migrations are located in `backend/supabase/migrations/`. You need to run them in your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `20251109045238_3a28aee0-4d3a-41b6-b945-d16bffa677d2.sql` (existing migration)
   - `20250110000000_add_bookings_wishlist_cart.sql` (new migration for bookings, wishlist, and cart)
   - `20250110000001_fix_rls_policies.sql` (RLS policy improvements)
   - `20250110000002_add_package_insert_function.sql` (Package insert function)

Alternatively, if you have Supabase CLI installed:

```bash
cd backend
supabase db push
```

### 4. Add Sample Packages (Optional)

You can add sample travel packages using the script:

```bash
cd backend
# Make sure your .env file is set up first
npm run add-packages
```

Or add packages manually through the Admin panel after logging in as an admin user.

### 5. Create an Admin User

To create an admin user:

1. Sign up a new user through the app
2. Go to your Supabase dashboard → Table Editor → `user_roles`
3. Find the user and update their role to `admin`, or insert a new row with:
   - `user_id`: The user's UUID from `auth.users`
   - `role`: `admin`

## Running the Application

### Development Mode

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

### ✅ Implemented Features

- **Authentication System**
  - User signup and login
  - Protected routes
  - Admin role management

- **Travel Packages**
  - Browse all packages
  - Search packages
  - View package details
  - Admin can create/edit packages

- **Booking System**
  - Create bookings for travel packages
  - View booking history in dashboard
  - Booking status management

- **Wishlist**
  - Add packages to wishlist
  - Remove from wishlist
  - View wishlist in dashboard

- **Shopping Cart**
  - Add packages to cart
  - Remove from cart
  - View cart in dashboard
  - Proceed to booking from cart

- **User Dashboard**
  - View all bookings
  - Manage wishlist
  - Manage cart
  - Tabbed interface

- **Navigation**
  - Cart and wishlist badges with counts
  - Dashboard link
  - Mobile-responsive navigation

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   └── ...              # Other components
│   ├── contexts/            # React contexts (Auth, Cart, Wishlist)
│   ├── pages/               # Page components
│   ├── integrations/       # Supabase integration
│   └── lib/                 # Utility functions
├── supabase/
│   └── migrations/         # Database migrations
└── scripts/                # Utility scripts
```

## Database Schema

### Tables

- `profiles` - User profiles
- `user_roles` - User roles (admin/user)
- `travel_packages` - Travel package listings
- `bookings` - User bookings
- `wishlist` - User wishlist items
- `cart` - User shopping cart items

## Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Sign up new user
   - [ ] Login with existing user
   - [ ] Logout
   - [ ] Protected routes redirect to login

2. **Packages**
   - [ ] Browse packages page
   - [ ] Search functionality
   - [ ] View package details
   - [ ] Admin can create/edit packages

3. **Booking**
   - [ ] Create booking from package detail page
   - [ ] View bookings in dashboard
   - [ ] Booking form validation

4. **Wishlist**
   - [ ] Add package to wishlist
   - [ ] Remove from wishlist
   - [ ] View wishlist in dashboard
   - [ ] Wishlist persists after logout/login

5. **Cart**
   - [ ] Add package to cart
   - [ ] Remove from cart
   - [ ] View cart in dashboard
   - [ ] Cart count badge in navbar
   - [ ] Proceed to booking from cart

6. **Dashboard**
   - [ ] View bookings tab
   - [ ] View wishlist tab
   - [ ] View cart tab
   - [ ] Tab navigation works

7. **Navigation**
   - [ ] Cart badge shows correct count
   - [ ] Wishlist badge shows correct count
   - [ ] Dashboard link visible when logged in
   - [ ] Mobile menu works

## Troubleshooting

### Supabase Connection Issues

1. Verify your `.env` file has correct values
2. Check Supabase project is active
3. Verify RLS policies are set correctly
4. Check browser console for errors

### Database Migration Issues

1. Ensure migrations are run in order
2. Check for any foreign key constraints
3. Verify RLS policies are created

### Build Issues

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Check for TypeScript errors: `npm run build`

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

## Support

For issues or questions, please check:
- Supabase documentation: https://supabase.com/docs
- React documentation: https://react.dev
- shadcn/ui documentation: https://ui.shadcn.com

