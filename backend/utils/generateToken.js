import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export const sendTokenResponse = (user, res, statusCode = 200) => {
  const token = generateToken(user.id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAMESITE || 'lax',
    maxAge: parseInt(process.env.JWT_COOKIE_MAX_AGE || '604800000', 10)
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      token,
      user
    });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default { generateToken, verifyToken, sendTokenResponse };

