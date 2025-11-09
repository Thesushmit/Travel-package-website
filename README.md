
# Travel Package Website - Book Your Dream Vacation

A modern, full-featured travel package booking platform built with React, TypeScript, and Supabase.

🌐 **Live Website**: [https://travel-package-website-nu.vercel.app/](https://travel-package-website-nu.vercel.app/)

📦 **Repository**: [https://github.com/Thesushmit/Travel-package-website](https://github.com/Thesushmit/Travel-package-website) 
## Features

✨ **Complete Booking System**
- Browse and search travel packages
- Detailed package information
- Secure booking system with date and guest selection
- Booking history and management

🛒 **Shopping Cart**
- Add packages to cart
- Manage cart items
- Quick checkout process

❤️ **Wishlist**
- Save favorite packages
- Easy wishlist management
- Quick access from navigation

👤 **User Dashboard**
- View all bookings
- Manage wishlist
- Manage shopping cart
- Tabbed interface for easy navigation

🔐 **Authentication**
- User signup and login
- Protected routes
- Admin role management
- Session persistence

🎨 **Modern UI**
- Beautiful, responsive design
- Dark mode support
- Mobile-friendly navigation
- Professional styling with shadcn/ui

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Build Tool**: Vite

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Thesushmit/Travel-package-website.git
cd Travel-package-website
```

2. Set up Backend:
```bash
cd backend
npm install
# Create .env file with Supabase credentials
# Run migrations in Supabase SQL Editor
```

3. Set up Frontend:
```bash
cd ../frontend
npm install
# Create .env file with Supabase credentials
```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration files in `backend/supabase/migrations/` in order

5. Start the development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:8080`

**Live Website**: [https://travel-package-website-nu.vercel.app/](https://travel-package-website-nu.vercel.app/)

## Setup Guide

For detailed setup instructions, including database migrations and sample data, see [SETUP.md](./SETUP.md).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
travel-package-website/
│
├── backend/                   # Backend configuration and database
│   ├── config/
│   │   └── db.js             # Supabase database connection
│   ├── models/
│   │   └── User.js            # User schema/model
│   ├── routes/
│   │   └── authRoutes.js      # Authentication routes
│   ├── controllers/
│   │   └── authController.js  # Authentication logic
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT token verification
│   ├── utils/
│   │   └── generateToken.js   # JWT generation helper
│   ├── supabase/             # Supabase configuration
│   │   ├── config.toml
│   │   └── migrations/       # Database migrations
│   ├── scripts/              # Utility scripts
│   └── package.json
│
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts (Auth, Cart, Wishlist)
│   │   ├── services/         # API services
│   │   ├── integrations/     # Supabase integration
│   │   └── lib/              # Utility functions
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── README.md                  # Project overview
├── SETUP.md                   # Detailed setup guide
├── vercel.json                # Vercel deployment config
└── .gitignore
```

## Features in Detail

### Booking System
- Create bookings with date and guest selection
- View booking history in dashboard
- Booking status tracking (pending, confirmed, cancelled, completed)

### Shopping Cart
- Add multiple packages to cart
- Update guest count
- Remove items
- Proceed to checkout

### Wishlist
- Save favorite packages
- Quick add/remove functionality
- Visual indicators for wishlisted items

### User Dashboard
- Comprehensive view of all user data
- Tabbed interface for easy navigation
- Quick actions for bookings, wishlist, and cart

## Testing

See [SETUP.md](./SETUP.md) for a comprehensive testing checklist.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check [SETUP.md](./SETUP.md) for setup help
- Review Supabase documentation: https://supabase.com/docs
- Review React documentation: https://react.dev
