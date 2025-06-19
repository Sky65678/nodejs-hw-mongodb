import * as fs from 'node:fs';
import path from 'node:path';

import { getEnvVar } from '../utils/getEnvVar.js';

import createError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

import { User } from '../models/auth.js';
import { Session } from '../models/session.js';

import { sendMail } from '../utils/sendMail.js';

const RESET_PASSWOR_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'reset-password.hbs'),
  'UTF-8',
);

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

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findOne({ _id: sessionId });

  if (session === null) {
    throw new createError.Unauthorized('Sessiom not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 60 * 60 * 1000),
  });
}

export async function requestResetPassword(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw new createError.NotFound('User not found!');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const template = Handlebars.compile(RESET_PASSWOR_TEMPLATE);

  await sendMail(
    user.email,
    'Reset password',
    template({ link: `http://localhost:3000/reset-password?token=${token}` }),
  );
}

export async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
    const user = await User.findById(decoded.sub);

    if (user === null) {
      throw new createError.NotFound('User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new createError.Unauthorized('Token is expired or invalid.');
    }

    if (error.name === 'TokenExpiredError') {
      throw new createError.Unauthorized('Token is expired or invalid.');
    }

    throw error;
  }
}
