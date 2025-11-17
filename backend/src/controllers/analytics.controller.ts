import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Project, AIGeneration } from '../models';
import { Op } from 'sequelize';

export const getDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    // Get project counts by status
    const projectStats = await Project.findAll({
      where: { userId },
      attributes: [
        'status',
        [Project.sequelize!.fn('COUNT', Project.sequelize!.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Get total projects
    const totalProjects = await Project.count({ where: { userId } });

    // Get recent projects
    const recentProjects = await Project.findAll({
      where: { userId },
      order: [['updatedAt', 'DESC']],
      limit: 5,
    });

    // Get AI usage stats
    const aiGenerations = await AIGeneration.findAll({
      include: [{
        model: Project,
        as: 'project',
        where: { userId },
        attributes: [],
      }],
    });

    const totalTokensUsed = aiGenerations.reduce((sum, gen) => sum + (gen.tokensUsed || 0), 0);

    res.json({
      success: true,
      data: {
        overview: {
          totalProjects,
          projectsByStatus: projectStats,
          recentProjects,
        },
        aiUsage: {
          totalGenerations: aiGenerations.length,
          totalTokensUsed,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const project = await Project.findOne({
      where: { id, userId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' },
      });
    }

    // Get AI generations for this project
    const aiGenerations = await AIGeneration.findAll({
      where: { projectId: id },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    const totalTokensUsed = aiGenerations.reduce((sum, gen) => sum + (gen.tokensUsed || 0), 0);

    res.json({
      success: true,
      data: {
        project,
        aiUsage: {
          totalGenerations: aiGenerations.length,
          totalTokensUsed,
          recentGenerations: aiGenerations,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
