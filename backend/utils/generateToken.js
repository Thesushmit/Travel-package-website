/**
 * Token Generation Utility
 * JWT token generation helper
 * Note: This project uses Supabase Auth, so tokens are managed by Supabase
 * This file is for reference/documentation purposes
 */

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} secret - Secret key
 * @param {Object} options - Token options
 * @returns {string} JWT token
 */
export const generateToken = (payload, secret, options = {}) => {
  // Supabase handles JWT generation automatically
  // Tokens are generated when users sign up or log in
  // Access token: Available in session.access_token
  // Refresh token: Available in session.refresh_token
  
  // If implementing custom JWT generation (not using Supabase):
  // const jwt = require('jsonwebtoken');
  // return jwt.sign(payload, secret, {
  //   expiresIn: options.expiresIn || '1h',
  //   ...options
  // });
  
  throw new Error('Token generation is handled by Supabase Auth. Use supabase.auth.getSession() to get tokens.');
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - Secret key
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token, secret) => {
  // Supabase handles token verification automatically
  // Use supabase.auth.getUser(token) to verify tokens
  
  // If implementing custom JWT verification (not using Supabase):
  // const jwt = require('jsonwebtoken');
  // return jwt.verify(token, secret);
  
  throw new Error('Token verification is handled by Supabase Auth. Use supabase.auth.getUser() to verify tokens.');
};

export default { generateToken, verifyToken };

