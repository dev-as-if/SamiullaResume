import { Request, Response } from 'express';
import * as geminiService from '../services/geminiService.js';

/**
 * Generate career objective
 */
export const generateCareerObjective = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobTitle, yearsExperience, industry, skills } = req.body;

    if (!jobTitle || yearsExperience === undefined || !industry) {
      res.status(400).json({
        error: 'Missing required fields: jobTitle, yearsExperience, industry',
      });
      return;
    }

    const response = await geminiService.generateCareerObjective({
      jobTitle,
      yearsExperience,
      industry,
      skills: Array.isArray(skills) ? skills : [],
    });

    res.json(response);
  } catch (error) {
    console.error('Error in generateCareerObjective:', error);
    res.status(500).json({
      error: 'Failed to generate career objective',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Generate role and responsibilities
 */
export const generateRoleResponsibilities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { profession, jobTitle, context } = req.body;

    console.log('[Controller] Received request:', { profession, jobTitle, contextKeys: Object.keys(context || {}) });

    if (!profession || !jobTitle) {
      console.warn('[Controller] Missing required fields');
      res.status(400).json({
        error: 'Missing required fields: profession, jobTitle',
      });
      return;
    }

    const response = await geminiService.generateRoleResponsibilities(
      profession,
      jobTitle,
      context || {}
    );

    console.log('[Controller] Successfully generated response');
    res.json(response);
  } catch (error) {
    console.error('[Controller] Error in generateRoleResponsibilities:', error);
    console.error('[Controller] Error details:', {
      name: error instanceof Error ? error.name : 'unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'no stack'
    });
    res.status(500).json({
      error: 'Failed to generate role responsibilities',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
};

/**
 * Generate skills
 */
export const generateSkills = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobTitle, yearsExperience, industry } = req.body;

    if (!jobTitle || yearsExperience === undefined || !industry) {
      res.status(400).json({
        error: 'Missing required fields: jobTitle, yearsExperience, industry',
      });
      return;
    }

    const response = await geminiService.generateSkills(
      jobTitle,
      yearsExperience,
      industry
    );

    res.json(response);
  } catch (error) {
    console.error('Error in generateSkills:', error);
    res.status(500).json({
      error: 'Failed to generate skills',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Generate improvements
 */
export const generateImprovements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { section, content, profession } = req.body;

    if (!section || !content || !profession) {
      res.status(400).json({
        error: 'Missing required fields: section, content, profession',
      });
      return;
    }

    const response = await geminiService.generateImprovements(
      section,
      content,
      profession
    );

    res.json(response);
  } catch (error) {
    console.error('Error in generateImprovements:', error);
    res.status(500).json({
      error: 'Failed to generate improvements',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Generate clarification questions
 */
export const generateClarificationQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { section, userInput, profession } = req.body;

    if (!section || !userInput || !profession) {
      res.status(400).json({
        error: 'Missing required fields: section, userInput, profession',
      });
      return;
    }

    const response = await geminiService.generateClarificationQuestions(
      section,
      userInput,
      profession
    );

    res.json({ questions: response });
  } catch (error) {
    console.error('Error in generateClarificationQuestions:', error);
    res.status(500).json({
      error: 'Failed to generate clarification questions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Generate resume section content
 */
export const generateResumeSectionContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { profession, section, userInput, context } = req.body;

    if (!profession || !section || !userInput) {
      res.status(400).json({
        error: 'Missing required fields: profession, section, userInput',
      });
      return;
    }

    const response = await geminiService.generateResumeSectionContent({
      profession,
      section,
      userInput,
      context,
    });

    res.json(response);
  } catch (error) {
    console.error('Error in generateResumeSectionContent:', error);
    res.status(500).json({
      error: 'Failed to generate resume section content',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Validate ATS compliance
 */
export const validateATSCompliance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { content, section } = req.body;

    if (!content || !section) {
      res.status(400).json({
        error: 'Missing required fields: content, section',
      });
      return;
    }

    const response = await geminiService.validateATSCompliance(
      content,
      section
    );

    res.json(response);
  } catch (error) {
    console.error('Error in validateATSCompliance:', error);
    res.status(500).json({
      error: 'Failed to validate ATS compliance',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Generate project description
 */
export const generateProjectDescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { projectName, projectDetails, technologies, professionalContext } = req.body;

    if (!projectName || !projectDetails) {
      res.status(400).json({
        error: 'Missing required fields: projectName, projectDetails',
      });
      return;
    }

    const response = await geminiService.generateProjectDescription(
      projectName,
      projectDetails,
      Array.isArray(technologies) ? technologies : [],
      professionalContext || {}
    );

    res.json(response);
  } catch (error) {
    console.error('Error in generateProjectDescription:', error);
    res.status(500).json({
      error: 'Failed to generate project description',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Generate achievement description
 */
export const generateAchievementDescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { accomplishment, context } = req.body;

    if (!accomplishment) {
      res.status(400).json({
        error: 'Missing required field: accomplishment',
      });
      return;
    }

    const response = await geminiService.generateAchievementDescription(
      accomplishment,
      context || {}
    );

    res.json(response);
  } catch (error) {
    console.error('Error in generateAchievementDescription:', error);
    res.status(500).json({
      error: 'Failed to generate achievement description',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Generate award description
 */
export const generateAwardDescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { awardTitle, organization, criteria } = req.body;

    if (!awardTitle || !organization) {
      res.status(400).json({
        error: 'Missing required fields: awardTitle, organization',
      });
      return;
    }

    const response = await geminiService.generateAwardDescription(
      awardTitle,
      organization,
      criteria
    );

    res.json(response);
  } catch (error) {
    console.error('Error in generateAwardDescription:', error);
    res.status(500).json({
      error: 'Failed to generate award description',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = (req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
};
