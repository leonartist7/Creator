import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { createError } from '../middleware/errorHandler';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    if (password.length < 8) {
      throw createError('Password must be at least 8 characters', 400);
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError('Email already registered', 409);
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    // Generate tokens
    const token = generateToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      data: {
        user: user.toSafeObject(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw createError('Invalid credentials', 401);
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    // Generate tokens
    const token = generateToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        user: user.toSafeObject(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = require('../utils/jwt').verifyToken(refreshToken);

    // Generate new tokens
    const newToken = generateToken({ userId: decoded.userId, email: decoded.email });
    const newRefreshToken = generateRefreshToken({ userId: decoded.userId, email: decoded.email });

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(createError('Invalid refresh token', 401));
  }
};

export const getMe = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      data: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};
