import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { generateWithAI, generateImage, AI_PROMPTS } from '../services/openai.service';
import { AIGeneration, Project } from '../models';

export const generateIdeas = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { niche, audience } = req.body;

    if (!niche) {
      throw createError('Niche is required', 400);
    }

    const prompt = AI_PROMPTS.ideaGeneration(niche, audience);
    const result = await generateWithAI(prompt, { responseFormat: 'json' });

    res.json({
      success: true,
      data: result.content,
    });
  } catch (error) {
    next(error);
  }
};

export const generateContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, prompt, type, options } = req.body;

    if (!projectId || !prompt) {
      throw createError('Project ID and prompt are required', 400);
    }

    // Verify project ownership
    const project = await Project.findOne({
      where: { id: projectId, userId: req.user!.userId },
    });

    if (!project) {
      throw createError('Project not found', 404);
    }

    const result = await generateWithAI(prompt, options);

    // Save AI generation
    await AIGeneration.create({
      projectId,
      prompt,
      response: typeof result.content === 'string' ? result.content : JSON.stringify(result.content),
      modelUsed: result.model,
      tokensUsed: result.tokensUsed,
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

export const generateOutline = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, topic, style } = req.body;

    if (!title || !topic) {
      throw createError('Title and topic are required', 400);
    }

    const prompt = AI_PROMPTS.chapterOutline(title, topic, style);
    const result = await generateWithAI(prompt, { responseFormat: 'json' });

    res.json({
      success: true,
      data: result.content,
    });
  } catch (error) {
    next(error);
  }
};

export const expandContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bullets, style } = req.body;

    if (!bullets) {
      throw createError('Bullet points are required', 400);
    }

    const prompt = AI_PROMPTS.contentExpansion(bullets, style);
    const result = await generateWithAI(prompt);

    res.json({
      success: true,
      data: result.content,
    });
  } catch (error) {
    next(error);
  }
};

export const improveText = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { text, improvement } = req.body;

    if (!text || !improvement) {
      throw createError('Text and improvement type are required', 400);
    }

    const prompt = AI_PROMPTS.improveText(text, improvement);
    const result = await generateWithAI(prompt);

    res.json({
      success: true,
      data: result.content,
    });
  } catch (error) {
    next(error);
  }
};

export const generateTitles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { topic, type } = req.body;

    if (!topic || !type) {
      throw createError('Topic and type are required', 400);
    }

    const prompt = AI_PROMPTS.titleGenerator(topic, type);
    const result = await generateWithAI(prompt, { responseFormat: 'json' });

    res.json({
      success: true,
      data: result.content,
    });
  } catch (error) {
    next(error);
  }
};

export const generateCover = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { prompt, size, quality, style } = req.body;

    if (!prompt) {
      throw createError('Prompt is required', 400);
    }

    const result = await generateImage(prompt, { size, quality, style });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const generateSalesCopy = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, type, audience, benefits } = req.body;

    if (!title || !type || !audience) {
      throw createError('Title, type, and audience are required', 400);
    }

    const prompt = AI_PROMPTS.salesCopy(title, type, audience, benefits || []);
    const result = await generateWithAI(prompt, { responseFormat: 'json' });

    res.json({
      success: true,
      data: result.content,
    });
  } catch (error) {
    next(error);
  }
};
