import createError from 'http-errors';
import bcrypt from 'bcrypt';

import { User } from '../models/auth.js';
import { Session } from '../models/session.js';

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createError.Unauthorized('Email or password in incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw createError.Unauthorized('Email or password in incorrect');
  }

  return Session.create({
    userId: user._id,
    accessToken: 'AccessToken',
    refreshToken: 'RefreshToken',
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 60 * 60 * 1000),
  });
}
