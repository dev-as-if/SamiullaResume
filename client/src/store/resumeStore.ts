import { create } from 'zustand';

export interface ResumeData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  profilePhoto?: string; // Base64 encoded image
  profession: string;
  yearsExperience: number;
  careerObjective: string;
  skills: {
    technical: string[];
    soft: string[];
    industrySpecific: string[];
  };
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    details?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  awards: Array<{
    id: string;
    title: string;
    organization: string;
    date: string;
    description?: string;
  }>;
  socialLinks: Array<{
    id: string;
    platform: string; // LinkedIn, GitHub, Portfolio, etc.
    url: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string; // Beginner, Intermediate, Advanced, Fluent
  }>;
  additionalSections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  templateId: string;
  lastUpdated: string;
  theme: {
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large'; // Changed to preset sizes
    lineSpacing: 'compact' | 'normal' | 'comfortable';
    autoOptimize: boolean; // Auto-optimize text size
  };
}

interface ResumeStore {
  resume: ResumeData;
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeResume: () => void;
  updateBasicInfo: (info: Partial<ResumeData>) => void;
  updateProfession: (profession: string, yearsExperience: number) => void;
  updateCareerObjective: (objective: string) => void;
  updateSkills: (skills: ResumeData['skills']) => void;
  addSkill: (category: 'technical' | 'soft' | 'industrySpecific', skill: string) => void;
  removeSkill: (category: 'technical' | 'soft' | 'industrySpecific', skill: string) => void;
  
  // Experience
  addExperience: (exp: ResumeData['experience'][0]) => void;
  updateExperience: (id: string, exp: Partial<ResumeData['experience'][0]>) => void;
  removeExperience: (id: string) => void;
  
  // Education (recursive support)
  addEducation: (edu: ResumeData['education'][0]) => void;
  updateEducation: (id: string, edu: Partial<ResumeData['education'][0]>) => void;
  removeEducation: (id: string) => void;
  
  // Certifications
  addCertification: (cert: ResumeData['certifications'][0]) => void;
  updateCertification: (id: string, cert: Partial<ResumeData['certifications'][0]>) => void;
  removeCertification: (id: string) => void;
  
  // Projects
  addProject: (project: ResumeData['projects'][0]) => void;
  updateProject: (id: string, project: Partial<ResumeData['projects'][0]>) => void;
  removeProject: (id: string) => void;
  
  // Awards
  addAward: (award: ResumeData['awards'][0]) => void;
  updateAward: (id: string, award: Partial<ResumeData['awards'][0]>) => void;
  removeAward: (id: string) => void;
  
  // Social Links
  addSocialLink: (link: ResumeData['socialLinks'][0]) => void;
  updateSocialLink: (id: string, link: Partial<ResumeData['socialLinks'][0]>) => void;
  removeSocialLink: (id: string) => void;
  
  // Languages
  addLanguage: (lang: ResumeData['languages'][0]) => void;
  updateLanguage: (id: string, lang: Partial<ResumeData['languages'][0]>) => void;
  removeLanguage: (id: string) => void;
  
  // Photo
  setProfilePhoto: (photoBase64: string) => void;
  removeProfilePhoto: () => void;
  
  updateTemplate: (templateId: string) => void;
  updateTheme: (theme: Partial<ResumeData['theme']>) => void;
  setCurrentStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetResume: () => void;
}

const initialResume: ResumeData = {
  id: `resume-${Date.now()}`,
  fullName: '',
  email: '',
  phone: '',
  location: '',
  profilePhoto: undefined,
  profession: '',
  yearsExperience: 0,
  careerObjective: '',
  skills: {
    technical: [],
    soft: [],
    industrySpecific: [],
  },
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  awards: [],
  socialLinks: [],
  languages: [],
  additionalSections: [],
  templateId: 'modern',
  lastUpdated: new Date().toISOString(),
  theme: {
    primaryColor: '#3b82f6',
    fontSize: 'medium',
    lineSpacing: 'normal',
    autoOptimize: true,
  },
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: initialResume,
  currentStep: 0,
  isLoading: false,
  error: null,

  initializeResume: () => {
    set({
      resume: {
        ...initialResume,
        id: `resume-${Date.now()}`,
        lastUpdated: new Date().toISOString(),
      },
    });
  },

  updateBasicInfo: (info) => {
    set((state) => ({
      resume: {
        ...state.resume,
        ...info,
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateProfession: (profession, yearsExperience) => {
    set((state) => ({
      resume: {
        ...state.resume,
        profession,
        yearsExperience,
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateCareerObjective: (objective) => {
    set((state) => ({
      resume: {
        ...state.resume,
        careerObjective: objective,
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateSkills: (skills) => {
    set((state) => ({
      resume: {
        ...state.resume,
        skills,
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  addSkill: (category, skill) => {
    set((state) => ({
      resume: {
        ...state.resume,
        skills: {
          ...state.resume.skills,
          [category]: [...state.resume.skills[category], skill],
        },
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  removeSkill: (category, skill) => {
    set((state) => ({
      resume: {
        ...state.resume,
        skills: {
          ...state.resume.skills,
          [category]: state.resume.skills[category].filter((s) => s !== skill),
        },
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  addExperience: (exp) => {
    set((state) => ({
      resume: {
        ...state.resume,
        experience: [...state.resume.experience, exp],
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateExperience: (id, exp) => {
    set((state) => ({
      resume: {
        ...state.resume,
        experience: state.resume.experience.map((e) =>
          e.id === id ? { ...e, ...exp } : e
        ),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  removeExperience: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        experience: state.resume.experience.filter((e) => e.id !== id),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  addEducation: (edu) => {
    set((state) => ({
      resume: {
        ...state.resume,
        education: [...state.resume.education, edu],
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateEducation: (id, edu) => {
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.map((e) =>
          e.id === id ? { ...e, ...edu } : e
        ),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  removeEducation: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.filter((e) => e.id !== id),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  addCertification: (cert) => {
    set((state) => ({
      resume: {
        ...state.resume,
        certifications: [...state.resume.certifications, cert],
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateCertification: (id, cert) => {
    set((state) => ({
      resume: {
        ...state.resume,
        certifications: state.resume.certifications.map((c) =>
          c.id === id ? { ...c, ...cert } : c
        ),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  removeCertification: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        certifications: state.resume.certifications.filter((c) => c.id !== id),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  addProject: (project) => {
    set((state) => ({
      resume: {
        ...state.resume,
        projects: [...state.resume.projects, project],
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateProject: (id, project) => {
    set((state) => ({
      resume: {
        ...state.resume,
        projects: state.resume.projects.map((p) =>
          p.id === id ? { ...p, ...project } : p
        ),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  removeProject: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        projects: state.resume.projects.filter((p) => p.id !== id),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  addAward: (award) => {
    set((state) => ({
      resume: {
        ...state.resume,
        awards: [...state.resume.awards, award],
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateAward: (id, award) => {
    set((state) => ({
      resume: {
        ...state.resume,
        awards: state.resume.awards.map((a) =>
          a.id === id ? { ...a, ...award } : a
        ),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  removeAward: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        awards: state.resume.awards.filter((a) => a.id !== id),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  addSocialLink: (link) => {
    set((state) => ({
      resume: {
        ...state.resume,
        socialLinks: [...state.resume.socialLinks, link],
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateSocialLink: (id, link) => {
    set((state) => ({
      resume: {
        ...state.resume,
        socialLinks: state.resume.socialLinks.map((l) =>
          l.id === id ? { ...l, ...link } : l
        ),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  removeSocialLink: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        socialLinks: state.resume.socialLinks.filter((l) => l.id !== id),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  addLanguage: (lang) => {
    set((state) => ({
      resume: {
        ...state.resume,
        languages: [...state.resume.languages, lang],
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateLanguage: (id, lang) => {
    set((state) => ({
      resume: {
        ...state.resume,
        languages: state.resume.languages.map((l) =>
          l.id === id ? { ...l, ...lang } : l
        ),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  removeLanguage: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        languages: state.resume.languages.filter((l) => l.id !== id),
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  setProfilePhoto: (photoBase64) => {
    set((state) => ({
      resume: {
        ...state.resume,
        profilePhoto: photoBase64,
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  removeProfilePhoto: () => {
    set((state) => ({
      resume: {
        ...state.resume,
        profilePhoto: undefined,
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateTemplate: (templateId) => {
    set((state) => ({
      resume: {
        ...state.resume,
        templateId,
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  updateTheme: (theme) => {
    set((state) => ({
      resume: {
        ...state.resume,
        theme: { ...state.resume.theme, ...theme },
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  resetResume: () => {
    set({
      resume: initialResume,
      currentStep: 0,
      error: null,
    });
  },
}));
