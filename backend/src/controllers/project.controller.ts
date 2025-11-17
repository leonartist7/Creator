import { Response, NextFunction } from 'express';
import { Project } from '../models';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAllProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user!.userId },
      order: [['updatedAt', 'DESC']],
    });

    res.json({
      success: true,
      data: projects,
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

    const project = await Project.findOne({
      where: { id, userId: req.user!.userId },
    });

    if (!project) {
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

    const project = await Project.create({
      userId: req.user!.userId,
      title,
      type,
      content: content || {},
      metadata: metadata || {},
    });

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

    const project = await Project.findOne({
      where: { id, userId: req.user!.userId },
    });

    if (!project) {
      throw createError('Project not found', 404);
    }

    await project.update({
      ...(title && { title }),
      ...(type && { type }),
      ...(content && { content }),
      ...(metadata && { metadata }),
      ...(status && { status }),
    });

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

    const project = await Project.findOne({
      where: { id, userId: req.user!.userId },
    });

    if (!project) {
      throw createError('Project not found', 404);
    }

    await project.destroy();

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
