/**
 * Authentication Routes
 * Routes for user authentication (signup/login)
 * Note: This project uses Supabase Auth, so these are handled client-side
 * This file is for reference/documentation purposes
 */

// Since we're using Supabase Auth on the frontend,
// authentication routes are handled client-side through Supabase SDK
// This file serves as documentation of the auth flow

export const authRoutes = {
  // Signup route (handled by Supabase Auth)
  signup: async (email, password, name) => {
    // Implemented in frontend/src/contexts/AuthContext.tsx
    // Uses: supabase.auth.signUp()
  },

  // Login route (handled by Supabase Auth)
  login: async (email, password) => {
    // Implemented in frontend/src/contexts/AuthContext.tsx
    // Uses: supabase.auth.signInWithPassword()
  },

  // Logout route (handled by Supabase Auth)
  logout: async () => {
    // Implemented in frontend/src/contexts/AuthContext.tsx
    // Uses: supabase.auth.signOut()
  },

  // Get current user (handled by Supabase Auth)
  getCurrentUser: async () => {
    // Implemented in frontend/src/contexts/AuthContext.tsx
    // Uses: supabase.auth.getUser()
  }
};

export default authRoutes;

