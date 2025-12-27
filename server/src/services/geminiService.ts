import { getGeminiModel } from '../config/gemini.js';

interface ResumeSectionGeneratorRequest {
  profession: string;
  section: string;
  userInput: string;
  context?: Record<string, any>;
}

interface ResumeSectionGeneratorResponse {
  variations: string[];
  suggestions: string[];
  keyWords: string[];
}

interface CareerObjectiveRequest {
  jobTitle: string;
  yearsExperience: number;
  industry: string;
  skills: string[];
}

/**
 * System prompt for resume generation
 */
const RESUME_SYSTEM_PROMPT = `You are an expert resume writer and career coach specialized in creating ATS-friendly resumes.
Your responsibilities:
1. Generate professional, concise, and impactful resume content
2. Optimize for ATS (Applicant Tracking Systems) by using industry-standard keywords
3. Ask clarifying questions when user input is vague
4. Provide variations of content (minimum 2-3 variations)
5. Suggest improvements and missing sections
6. Maintain a professional yet friendly tone
7. Always respond in valid JSON format for consistency

Guidelines:
- Keep bullet points concise (10-15 words per point)
- Use action verbs (Led, Developed, Implemented, etc.)
- Quantify achievements when possible
- Avoid personal pronouns (I, Me, My)
- Use industry-specific terminology
- Ensure content is truthful and realistic
- Focus on impact and results
- Return ONLY valid JSON, no markdown or extra text`;

/**
 * Helper function to parse JSON from response with fallback
 */
const parseJsonResponse = (text: string): any => {
  try {
    // Try direct JSON parse first
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                      text.match(/```\s*([\s\S]*?)\s*```/) ||
                      text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[0];
      try {
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse extracted JSON:', jsonString, parseError);
        throw new Error('Could not parse response as JSON');
      }
    }
    
    throw new Error('No JSON found in response');
  }
};

/**
 * Generate career objective/summary variations
 */
export const generateCareerObjective = async (
  req: CareerObjectiveRequest
): Promise<ResumeSectionGeneratorResponse> => {
  const model = getGeminiModel();

  const prompt = `${RESUME_SYSTEM_PROMPT}

Generate 3 professional career objective variations for:
- Job Title: ${req.jobTitle}
- Years of Experience: ${req.yearsExperience}
- Industry: ${req.industry}
- Key Skills: ${req.skills.join(', ')}

Respond ONLY with valid JSON (no markdown):
{
  "variations": ["objective 1", "objective 2", "objective 3"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "keyWords": ["keyword1", "keyword2", "keyword3"]
}`;

  try {
    const result = await model.generateContent(prompt);
    
    if (!result.response) {
      throw new Error('Empty response from Gemini API');
    }
    
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('No text in API response');
    }

    return parseJsonResponse(responseText);
  } catch (error) {
    console.error('Error generating career objective:', error);
    throw new Error(`Failed to generate career objective: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate role and responsibilities
 */
export const generateRoleResponsibilities = async (
  profession: string,
  jobTitle: string,
  context: Record<string, any>
): Promise<ResumeSectionGeneratorResponse> => {
  const model = getGeminiModel();

  // Extract useful context
  const yearsExperience = context?.yearsExperience || 'unspecified';
  const skills = context?.skills ? context.skills.join(', ') : 'general skills';
  const company = context?.company || 'company';
  const industry = context?.industry || profession;
  const department = context?.department || 'relevant department';

  // Simplified prompt for faster response
  const prompt = `You are an expert resume writer. Generate 3-5 specific job responsibilities for:
Position: ${jobTitle}
Company: ${company}
Industry: ${industry}

Return ONLY this exact JSON format:
{
  "variations": [
    "Responsibility 1",
    "Responsibility 2",
    "Responsibility 3",
    "Responsibility 4",
    "Responsibility 5"
  ],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "keyWords": ["keyword1", "keyword2", "keyword3"]
}`;

  try {
    console.log(`[generateRoleResponsibilities] Starting generation for: ${jobTitle}`);
    
    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API request timeout after 30 seconds')), 30000)
    );
    
    const generatePromise = (async () => {
      const result = await model.generateContent(prompt);
      
      if (!result || !result.response) {
        throw new Error('Empty response from Gemini API');
      }
      
      const responseText = result.response.text();
      console.log(`[generateRoleResponsibilities] Got response text (${responseText.length} chars)`);
      
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Gemini API returned empty response');
      }

      const parsed = parseJsonResponse(responseText);
      console.log(`[generateRoleResponsibilities] Successfully parsed JSON`);
      
      // Ensure variations is an array
      if (!Array.isArray(parsed.variations)) {
        parsed.variations = [parsed.variations].filter(Boolean);
      }
      
      if (parsed.variations.length === 0) {
        throw new Error('No variations in response');
      }
      
      return parsed;
    })();
    
    return await Promise.race([generatePromise, timeoutPromise]) as ResumeSectionGeneratorResponse;
  } catch (error) {
    console.error('[generateRoleResponsibilities] Error:', error);
    if (error instanceof Error) {
      console.error('[generateRoleResponsibilities] Error message:', error.message);
      console.error('[generateRoleResponsibilities] Error stack:', error.stack);
    }
    throw error;
  }
};

/**
 * Generate skills list with categorization
 */
export const generateSkills = async (
  jobTitle: string,
  yearsExperience: number,
  industry: string
): Promise<{
  technical: string[];
  soft: string[];
  industrySpecific: string[];
}> => {
  const model = getGeminiModel();

  const prompt = `${RESUME_SYSTEM_PROMPT}

Generate a comprehensive skill list for a ${jobTitle} with ${yearsExperience} years of experience in the ${industry} industry.

Respond ONLY with valid JSON (no markdown):
{
  "technical": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "soft": ["skill1", "skill2", "skill3", "skill4"],
  "industrySpecific": ["skill1", "skill2", "skill3", "skill4"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('No text in API response');
    }

    return parseJsonResponse(responseText);
  } catch (error) {
    console.error('Error generating skills:', error);
    throw new Error(`Failed to generate skills: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate content improvements suggestions
 */
export const generateImprovements = async (
  section: string,
  content: string,
  profession: string
): Promise<{
  suggestions: string[];
  rewrite: string;
  missingPoints: string[];
}> => {
  const model = getGeminiModel();

  const prompt = `${RESUME_SYSTEM_PROMPT}

Analyze this resume ${section} and provide improvements:
"${content}"

Profession: ${profession}

Respond ONLY with valid JSON (no markdown):
{
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "rewrite": "improved version of the content",
  "missingPoints": ["missing point 1", "missing point 2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('No text in API response');
    }

    return parseJsonResponse(responseText);
  } catch (error) {
    console.error('Error generating improvements:', error);
    throw new Error(`Failed to generate improvements: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate follow-up clarification questions
 */
export const generateClarificationQuestions = async (
  section: string,
  userInput: string,
  profession: string
): Promise<string[]> => {
  const model = getGeminiModel();

  const prompt = `You are a professional resume coach. Based on the user's input, generate 2-3 clarification questions to gather more specific information.

Section: ${section}
User Input: "${userInput}"
Profession: ${profession}

Respond ONLY with a JSON array of questions (no markdown):
["question 1", "question 2", "question 3"]`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('No text in API response');
    }

    return parseJsonResponse(responseText);
  } catch (error) {
    console.error('Error generating clarification questions:', error);
    return [];
  }
};

/**
 * Generate comprehensive resume section
 */
export const generateResumeSectionContent = async (
  req: ResumeSectionGeneratorRequest
): Promise<ResumeSectionGeneratorResponse> => {
  const model = getGeminiModel();

  const prompt = `${RESUME_SYSTEM_PROMPT}

Generate professional resume content for the ${req.section} section.
Profession: ${req.profession}
User Input: "${req.userInput}"
${req.context ? `Additional Context: ${JSON.stringify(req.context)}` : ''}

Respond ONLY with valid JSON (no markdown):
{
  "variations": ["variation 1", "variation 2", "variation 3"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "keyWords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('No text in API response');
    }

    return parseJsonResponse(responseText);
  } catch (error) {
    console.error('Error generating resume section content:', error);
    throw new Error(`Failed to generate section content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate project descriptions based on project details
 */
export const generateProjectDescription = async (
  projectName: string,
  projectDetails: string,
  technologies: string[],
  professionalContext: {
    jobTitle?: string;
    industry?: string;
    yearsExperience?: number;
  }
): Promise<{
  descriptions: string[];
  keyTechnologies: string[];
  impactPoints: string[];
}> => {
  const model = getGeminiModel();

  const techList = technologies.length > 0 ? technologies.join(', ') : 'various technologies';

  const prompt = `${RESUME_SYSTEM_PROMPT}

Generate 3 compelling project descriptions for:
Project Name: "${projectName}"
Details: "${projectDetails}"
Technologies: ${techList}
Context: ${professionalContext.jobTitle ? `${professionalContext.jobTitle}` : 'general project'} in ${professionalContext.industry || 'the industry'}

Each description should:
1. Start with strong action verb
2. Explain the project's purpose and impact
3. Highlight key technical achievements
4. Mention measurable results if applicable
5. Be 2-3 sentences (25-35 words)

Respond ONLY with valid JSON (no markdown):
{
  "descriptions": ["compelling description 1", "compelling description 2", "compelling description 3"],
  "keyTechnologies": ["tech1", "tech2", "tech3"],
  "impactPoints": ["impact point 1", "impact point 2", "impact point 3"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('No text in API response');
    }

    return parseJsonResponse(responseText);
  } catch (error) {
    console.error('Error generating project description:', error);
    throw new Error(`Failed to generate project description: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate achievement descriptions based on accomplishment context
 */
export const generateAchievementDescription = async (
  accomplishment: string,
  context: {
    jobTitle?: string;
    company?: string;
    industry?: string;
    impact?: string;
  }
): Promise<{
  descriptions: string[];
  metrics: string[];
  keywords: string[];
}> => {
  const model = getGeminiModel();

  const prompt = `${RESUME_SYSTEM_PROMPT}

Transform this accomplishment into 3 professional, metrics-driven descriptions:
Accomplishment: "${accomplishment}"
Position: ${context.jobTitle || 'relevant role'}
Company: ${context.company || 'organization'}
Industry: ${context.industry || 'industry'}
${context.impact ? `Impact: ${context.impact}` : ''}

Each description should:
1. Use strong action verbs (Increased, Reduced, Improved, Achieved, etc.)
2. Include or suggest quantifiable metrics (%, $, time savings, etc.)
3. Show business value and impact
4. Be concise (15-20 words)
5. Be unique and approach from different angles

Respond ONLY with valid JSON (no markdown):
{
  "descriptions": ["achievement 1 with metrics", "achievement 2 with metrics", "achievement 3 with metrics"],
  "metrics": ["potential metric 1", "potential metric 2", "potential metric 3"],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('No text in API response');
    }

    return parseJsonResponse(responseText);
  } catch (error) {
    console.error('Error generating achievement description:', error);
    throw new Error(`Failed to generate achievement description: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate award/certification descriptions
 */
export const generateAwardDescription = async (
  awardTitle: string,
  organization: string,
  criteria?: string
): Promise<{
  descriptions: string[];
  significance: string[];
}> => {
  const model = getGeminiModel();

  const prompt = `${RESUME_SYSTEM_PROMPT}

Generate 2 professional descriptions for this award/certification:
Award: "${awardTitle}"
Organization: "${organization}"
${criteria ? `Criteria/Achievement: "${criteria}"` : ''}

Each description should:
1. Explain the significance of the award
2. Highlight what it demonstrates about the recipient
3. Be 1-2 sentences
4. Sound professional and humble

Also provide significance points explaining why this award matters.

Respond ONLY with valid JSON (no markdown):
{
  "descriptions": ["description 1 explaining the award's importance", "description 2 with different angle"],
  "significance": ["why this matters point 1", "why this matters point 2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('No text in API response');
    }

    return parseJsonResponse(responseText);
  } catch (error) {
    console.error('Error generating award description:', error);
    throw new Error(`Failed to generate award description: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Validate resume content for ATS compliance
 */
export const validateATSCompliance = async (
  content: string,
  section: string
): Promise<{
  isCompliant: boolean;
  issues: string[];
  recommendations: string[];
}> => {
  const model = getGeminiModel();

  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume content for ATS compliance.

Section: ${section}
Content: "${content}"

Check for:
1. Proper formatting
2. Industry keywords
3. Readability for parsers
4. No special characters that might break parsing
5. Proper structure

Respond ONLY with valid JSON (no markdown):
{
  "isCompliant": true,
  "issues": ["issue 1", "issue 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('No text in API response');
    }

    return parseJsonResponse(responseText);
  } catch (error) {
    console.error('Error validating ATS compliance:', error);
    return {
      isCompliant: true,
      issues: [],
      recommendations: [],
    };
  }
};
