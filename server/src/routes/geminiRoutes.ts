import { Router } from 'express';
import * as geminiController from '../controllers/geminiController.js';

const router = Router();

/**
 * Health check route
 */
router.get('/health', geminiController.healthCheck);

/**
 * Gemini AI routes
 */
router.post('/generate/career-objective', geminiController.generateCareerObjective);
router.post('/generate/role-responsibilities', geminiController.generateRoleResponsibilities);
router.post('/generate/skills', geminiController.generateSkills);
router.post('/generate/improvements', geminiController.generateImprovements);
router.post('/generate/clarification-questions', geminiController.generateClarificationQuestions);
router.post('/generate/resume-section', geminiController.generateResumeSectionContent);
router.post('/generate/project-description', geminiController.generateProjectDescription);
router.post('/generate/achievement-description', geminiController.generateAchievementDescription);
router.post('/generate/award-description', geminiController.generateAwardDescription);
router.post('/validate/ats-compliance', geminiController.validateATSCompliance);

export default router;
