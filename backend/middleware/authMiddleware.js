/**
 * Authentication Middleware
 * Verify JWT token and user authentication
 * Note: This project uses Supabase Auth, so token verification is handled by Supabase
 * This file is for reference/documentation purposes
 */

import { supabase } from '../config/db.js';

/**
 * Verify authentication token
 * @param {string} token - JWT token
 * @returns {Promise<Object>} User data if valid
 */
export const verifyToken = async (token) => {
  // Supabase handles token verification automatically
  // This is implemented in frontend/src/contexts/AuthContext.tsx
  // Uses: supabase.auth.getUser()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return user;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Request object (if using Express)
 * @param {Object} res - Response object (if using Express)
 * @param {Function} next - Next middleware function
 */
export const requireAuth = async (req, res, next) => {
  // For Supabase, authentication is checked client-side
  // This would be used if implementing a Node.js/Express backend
  // Currently handled by ProtectedRoute component in frontend
};

/**
 * Middleware to check if user is admin
 * @param {Object} req - Request object (if using Express)
 * @param {Object} res - Response object (if using Express)
 * @param {Function} next - Next middleware function
 */
export const requireAdmin = async (req, res, next) => {
  // For Supabase, admin check is done via RLS policies
  // This would be used if implementing a Node.js/Express backend
  // Currently handled by ProtectedRoute component in frontend
};

export default { verifyToken, requireAuth, requireAdmin };

