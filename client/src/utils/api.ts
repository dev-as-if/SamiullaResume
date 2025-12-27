import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ Error:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface GenerateCareerObjectiveRequest {
  jobTitle: string;
  yearsExperience: number;
  industry: string;
  skills?: string[];
}

export interface GenerateCareerObjectiveResponse {
  variations: string[];
  suggestions: string[];
  keyWords: string[];
}

export interface GenerateSkillsResponse {
  technical: string[];
  soft: string[];
  industrySpecific: string[];
}

export interface GenerateImprovementsResponse {
  suggestions: string[];
  rewrite: string;
  missingPoints: string[];
}

/**
 * Generate career objective variations
 */
export const generateCareerObjective = (
  data: GenerateCareerObjectiveRequest
): Promise<GenerateCareerObjectiveResponse> => {
  return apiClient
    .post('/api/ai/generate/career-objective', data)
    .then((res) => res.data);
};

/**
 * Generate role and responsibilities
 */
export const generateRoleResponsibilities = (
  profession: string,
  jobTitle: string,
  context?: Record<string, any>
): Promise<any> => {
  return apiClient
    .post('/api/ai/generate/role-responsibilities', {
      profession,
      jobTitle,
      context,
    })
    .then((res) => res.data);
};

/**
 * Generate skills
 */
export const generateSkills = (
  jobTitle: string,
  yearsExperience: number,
  industry: string
): Promise<GenerateSkillsResponse> => {
  return apiClient
    .post('/api/ai/generate/skills', {
      jobTitle,
      yearsExperience,
      industry,
    })
    .then((res) => res.data);
};

/**
 * Generate improvements
 */
export const generateImprovements = (
  section: string,
  content: string,
  profession: string
): Promise<GenerateImprovementsResponse> => {
  return apiClient
    .post('/api/ai/generate/improvements', {
      section,
      content,
      profession,
    })
    .then((res) => res.data);
};

/**
 * Generate clarification questions
 */
export const generateClarificationQuestions = (
  section: string,
  userInput: string,
  profession: string
): Promise<{ questions: string[] }> => {
  return apiClient
    .post('/api/ai/generate/clarification-questions', {
      section,
      userInput,
      profession,
    })
    .then((res) => res.data);
};

/**
 * Generate resume section content
 */
export const generateResumeSection = (
  profession: string,
  section: string,
  userInput: string,
  context?: Record<string, any>
): Promise<any> => {
  return apiClient
    .post('/api/ai/generate/resume-section', {
      profession,
      section,
      userInput,
      context,
    })
    .then((res) => res.data);
};

/**
 * Validate ATS compliance
 */
export const validateATSCompliance = (
  content: string,
  section: string
): Promise<any> => {
  return apiClient
    .post('/api/ai/validate/ats-compliance', {
      content,
      section,
    })
    .then((res) => res.data);
};

/**
 * Health check
 */
export const healthCheck = (): Promise<any> => {
  console.log(`🏥 Health check: ${API_BASE_URL}/api/ai/health`);
  return apiClient.get('/api/ai/health').then((res) => {
    console.log('✅ Backend is healthy');
    return res.data;
  }).catch((error) => {
    console.error('❌ Health check failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  });
};

export default apiClient;
