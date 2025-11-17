import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import {
  generateIdeas,
  generateOutline,
  expandContent,
  improveText,
  generateTitles,
  generateSalesCopy,
  generateWithClaude,
} from '../services/anthropic.service';
import { supabase } from '../config/supabase';

export const generateIdeasController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { niche, audience } = req.body;

    if (!niche) {
      throw createError('Niche is required', 400);
    }

    const result = await generateIdeas(niche, audience);

    res.json({
      success: true,
      data: result.content,
      meta: {
        tokensUsed: result.tokensUsed,
        model: result.model,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const generateContentController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, prompt, options } = req.body;

    if (!projectId || !prompt) {
      throw createError('Project ID and prompt are required', 400);
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', req.user!.userId)
      .single();

    if (projectError || !project) {
      throw createError('Project not found', 404);
    }

    const result = await generateWithClaude(prompt, options);

    // Save AI generation
    await supabase.from('ai_generations').insert({
      project_id: projectId,
      user_id: req.user!.userId,
      prompt,
      response: typeof result.content === 'string' ? result.content : JSON.stringify(result.content),
      model_used: result.model,
      tokens_used: result.tokensUsed,
    });

    res.json({
      success: true,
      data: result.content,
      meta: {
        tokensUsed: result.tokensUsed,
        model: result.model,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const generateOutlineController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, topic, style } = req.body;

    if (!title || !topic) {
      throw createError('Title and topic are required', 400);
    }

    const result = await generateOutline(title, topic, style);

    res.json({
      success: true,
      data: result.content,
      meta: {
        tokensUsed: result.tokensUsed,
        model: result.model,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const expandContentController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bullets, style } = req.body;

    if (!bullets) {
      throw createError('Bullet points are required', 400);
    }

    const result = await expandContent(bullets, style);

    res.json({
      success: true,
      data: result.content,
      meta: {
        tokensUsed: result.tokensUsed,
        model: result.model,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const improveTextController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { text, improvement } = req.body;

    if (!text || !improvement) {
      throw createError('Text and improvement type are required', 400);
    }

    const result = await improveText(text, improvement);

    res.json({
      success: true,
      data: result.content,
      meta: {
        tokensUsed: result.tokensUsed,
        model: result.model,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const generateTitlesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { topic, type } = req.body;

    if (!topic || !type) {
      throw createError('Topic and type are required', 400);
    }

    const result = await generateTitles(topic, type);

    res.json({
      success: true,
      data: result.content,
      meta: {
        tokensUsed: result.tokensUsed,
        model: result.model,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const generateSalesCopyController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, type, audience, benefits } = req.body;

    if (!title || !type || !audience) {
      throw createError('Title, type, and audience are required', 400);
    }

    const result = await generateSalesCopy(title, type, audience, benefits || []);

    res.json({
      success: true,
      data: result.content,
      meta: {
        tokensUsed: result.tokensUsed,
        model: result.model,
      },
    });
  } catch (error) {
    next(error);
  }
};
