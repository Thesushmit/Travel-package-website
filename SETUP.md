# Wanderlust Hub - Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB running locally (e.g. via MongoDB Compass) or hosted on Atlas

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend Environment

Create `backend/.env` with values similar to:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/travelDB
JWT_SECRET=super_secret_key_change_me
JWT_EXPIRES_IN=7d
JWT_COOKIE_MAX_AGE=604800000
CLIENT_ORIGIN=http://localhost:5173
```

Then install backend dependencies and start the server:

```bash
cd backend
npm install
npm run dev
```

The API will connect to the MongoDB URI you supply. When using MongoDB Compass, ensure the database name (`travelDB`) matches the one shown in the connection screenshot.

### 3. Configure Frontend Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Install dependencies and start the Vite dev server:

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:8080` and communicates with the backend through the configured API URL.

### 4. Create an Admin User

1. Register a new user via the `/signup` page.
2. Open MongoDB Compass and navigate to the `users` collection.
3. Update the user document's `role` field to `"admin"` to grant admin privileges.

## Project Structure

```
├── backend/                 # Express API
│   ├── controllers/         # Auth, packages, bookings, cart, wishlist
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Route definitions
│   ├── middleware/          # Auth middleware
│   ├── utils/               # JWT helpers
│   └── server.js            # API entry point
└── frontend/                # React + Vite client
    ├── components/          # UI components
    ├── contexts/            # Auth, cart, wishlist providers
    ├── pages/               # Route pages
    └── services/api.ts      # REST API helpers
```

## Manual Testing Checklist

- **Authentication**
  - Register, login, logout
  - Confirm protected routes redirect when unauthenticated
- **Packages**
  - Browse, search, filter, and view package details
  - Create packages via admin panel (admin role required)
- **Bookings**
  - Book a package from the detail page
  - Verify bookings appear in the dashboard
- **Wishlist & Cart**
  - Add/remove items and ensure counts update in navbar
- **Dashboard**
  - Switch between bookings, wishlist, and cart tabs

## Troubleshooting

- **MongoDB Connection**: Confirm `MONGODB_URI` is reachable (Compass screenshot shows `mongodb://127.0.0.1:27017/travelDB`).
- **CORS Errors**: Ensure `CLIENT_ORIGIN` matches the frontend URL.
- **JWT Issues**: Regenerate `JWT_SECRET` and restart backend if tokens stop working.

For additional help, refer to the README or open an issue in the repository.

