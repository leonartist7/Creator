import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
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

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (authError) {
      throw createError(authError.message, 400);
    }

    if (!authData.user || !authData.session) {
      throw createError('Failed to create user', 500);
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          firstName: profile?.first_name,
          lastName: profile?.last_name,
          subscriptionTier: profile?.subscription_tier || 'free',
          isEmailVerified: authData.user.email_confirmed_at != null,
        },
        token: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
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

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw createError('Invalid credentials', 401);
    }

    if (!authData.user || !authData.session) {
      throw createError('Invalid credentials', 401);
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    res.json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          firstName: profile?.first_name,
          lastName: profile?.last_name,
          subscriptionTier: profile?.subscription_tier || 'free',
          isEmailVerified: authData.user.email_confirmed_at != null,
        },
        token: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
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

    // Refresh session with Supabase
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw createError('Invalid refresh token', 401);
    }

    if (!data.session) {
      throw createError('Failed to refresh session', 401);
    }

    res.json({
      success: true,
      data: {
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;

    // Get user from Supabase
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);

    if (authError || !authUser.user) {
      throw createError('User not found', 404);
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    res.json({
      success: true,
      data: {
        id: authUser.user.id,
        email: authUser.user.email,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        subscriptionTier: profile?.subscription_tier || 'free',
        isEmailVerified: authUser.user.email_confirmed_at != null,
      },
    });
  } catch (error) {
    next(error);
  }
};
