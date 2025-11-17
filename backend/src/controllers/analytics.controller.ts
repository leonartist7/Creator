import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

export const getDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    // Get all projects for stats
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('status')
      .eq('user_id', userId);

    if (projectsError) {
      throw projectsError;
    }

    // Calculate project stats
    const projectsByStatus = projects?.reduce((acc: any, proj) => {
      const status = proj.status;
      const existing = acc.find((s: any) => s.status === status);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ status, count: 1 });
      }
      return acc;
    }, []) || [];

    // Get recent projects
    const { data: recentProjects } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(5);

    // Get AI usage stats
    const { data: aiGenerations } = await supabase
      .from('ai_generations')
      .select('tokens_used')
      .eq('user_id', userId);

    const totalTokensUsed = aiGenerations?.reduce((sum, gen) => sum + (gen.tokens_used || 0), 0) || 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalProjects: projects?.length || 0,
          projectsByStatus,
          recentProjects: recentProjects || [],
        },
        aiUsage: {
          totalGenerations: aiGenerations?.length || 0,
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
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (projectError || !project) {
      res.status(404).json({
        success: false,
        error: { message: 'Project not found' },
      });
      return;
    }

    // Get AI generations for this project
    const { data: aiGenerations } = await supabase
      .from('ai_generations')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    const totalTokensUsed = aiGenerations?.reduce((sum, gen) => sum + (gen.tokens_used || 0), 0) || 0;

    res.json({
      success: true,
      data: {
        project,
        aiUsage: {
          totalGenerations: aiGenerations?.length || 0,
          totalTokensUsed,
          recentGenerations: aiGenerations || [],
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
