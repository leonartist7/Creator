import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAllProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', req.user!.userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: projects || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user!.userId)
      .single();

    if (error || !project) {
      throw createError('Project not found', 404);
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, type, content, metadata } = req.body;

    if (!title || !type) {
      throw createError('Title and type are required', 400);
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: req.user!.userId,
        title,
        type,
        content: content || {},
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 500);
    }

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, type, content, metadata, status } = req.body;

    const updates: any = {};
    if (title) updates.title = title;
    if (type) updates.type = type;
    if (content !== undefined) updates.content = content;
    if (metadata !== undefined) updates.metadata = metadata;
    if (status) updates.status = status;

    const { data: project, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.user!.userId)
      .select()
      .single();

    if (error || !project) {
      throw createError('Project not found', 404);
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user!.userId);

    if (error) {
      throw createError('Project not found', 404);
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
