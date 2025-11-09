/**
 * Authentication Controller
 * Business logic for authentication operations
 * Note: This project uses Supabase Auth, so authentication is handled client-side
 * This file is for reference/documentation purposes
 */

import { User } from '../models/User.js';

export const authController = {
  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @returns {Promise<Object>} User data
   */
  signup: async (email, password, name) => {
    // Implemented in frontend/src/contexts/AuthContext.tsx
    // Supabase automatically creates profile via trigger
    // Returns: { user, session, error }
  },

  /**
   * Sign in existing user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Session data
   */
  login: async (email, password) => {
    // Implemented in frontend/src/contexts/AuthContext.tsx
    // Returns: { session, user, error }
  },

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    // Implemented in frontend/src/contexts/AuthContext.tsx
    // Clears session and redirects
  },

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  getProfile: async (userId) => {
    return await User.getProfile(userId);
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated profile
   */
  updateProfile: async (userId, updates) => {
    return await User.updateProfile(userId, updates);
  },

  /**
   * Check admin status
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if admin
   */
  checkAdminStatus: async (userId) => {
    return await User.isAdmin(userId);
  }
};

export default authController;

