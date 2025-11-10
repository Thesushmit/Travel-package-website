/**
 * Authentication Controller
 * Business logic for authentication operations
 * Note: This project uses Supabase Auth, so authentication is handled client-side
 * This file is for reference/documentation purposes
 */

import User from '../models/User.js';
import { sendTokenResponse } from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });
  sendTokenResponse(user, res, 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  sendTokenResponse(user, res, 200);
};

export const logout = async (_req, res) => {
  res
    .status(200)
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    })
    .json({ message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const updateProfile = async (req, res) => {
  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.avatar_url !== undefined) updates.avatar_url = req.body.avatar_url;

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  res.status(200).json({ user });
};

export const checkAdmin = async (req, res) => {
  res.status(200).json({ isAdmin: req.user?.role === 'admin' });
};

