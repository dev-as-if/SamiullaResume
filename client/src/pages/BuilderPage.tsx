import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useResumeStore } from '../store/resumeStore';
import StepIndicator from '../components/StepIndicator';
import ConversationalInput from '../components/ConversationalInput';
import ExperienceEditor from '../components/ExperienceEditor';
import ExportModal from '../components/ExportModal';
import SkillManagement from '../components/SkillManagement';
import PhotoUpload from '../components/PhotoUpload';
import MultiEntryForm from '../components/MultiEntryForm';
import TemplateRenderer from '../templates/TemplateRenderer';
import * as api from '../utils/api';
import { v4 as uuidv4 } from 'uuid';

type BuilderStep =
  | 'basic'
  | 'profession'
  | 'objective'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'awards'
  | 'socials'
  | 'languages'
  | 'preview';

interface StepConfig {
  id: BuilderStep;
  label: string;
  title: string;
}

const STEPS: StepConfig[] = [
  { id: 'basic', label: 'Basic Info', title: 'Tell us about yourself' },
  { id: 'profession', label: 'Profession', title: 'What\'s your profession?' },
  { id: 'objective', label: 'Career Objective', title: 'Your career goals' },
  { id: 'skills', label: 'Skills', title: 'Your skills' },
  { id: 'experience', label: 'Experience', title: 'Work experience' },
  { id: 'projects', label: 'Projects', title: 'Your projects' },
  { id: 'education', label: 'Education', title: 'Your education' },
  { id: 'certifications', label: 'Certifications', title: 'Certifications & credentials' },
  { id: 'awards', label: 'Awards', title: 'Awards & recognition' },
  { id: 'socials', label: 'Social Links', title: 'Your online presence' },
  { id: 'languages', label: 'Languages', title: 'Languages you speak' },
  { id: 'preview', label: 'Preview & Export', title: 'Finalize your resume' },
];

interface BuilderPageProps {
  onBack: () => void;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({ onBack }) => {
  const {
    resume,
    updateBasicInfo,
    updateProfession,
    updateCareerObjective,
    updateSkills,
    addSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    addEducation,
    updateEducation,
    removeEducation,
    addCertification,
    updateCertification,
    removeCertification,
    addAward,
    updateAward,
    removeAward,
    addSocialLink,
    updateSocialLink,
    removeSocialLink,
    addLanguage,
    updateLanguage,
    removeLanguage,
    setProfilePhoto,
    removeProfilePhoto,
    updateTheme,
    updateTemplate,
  } = useResumeStore();

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isExperienceEditorOpen, setIsExperienceEditorOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentStep = STEPS[currentStepIdx];

  const handleNext = () => {
    if (!validateStep(currentStep.id)) {
      return;
    }
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    } else {
      onBack();
    }
  };

  const validateStep = (stepId: BuilderStep): boolean => {
    switch (stepId) {
      case 'basic':
        if (!resume.fullName || !resume.email || !resume.phone) {
          toast.error('Please fill in all basic information');
          return false;
        }
        return true;
      case 'profession':
        if (!resume.profession || resume.yearsExperience === 0) {
          toast.error('Please select your profession');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'basic':
        return (
          <motion.div
            key="basic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                value={resume.fullName}
                onChange={(e) =>
                  updateBasicInfo({ fullName: e.target.value })
                }
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) =>
                    updateBasicInfo({ email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={resume.phone}
                  onChange={(e) =>
                    updateBasicInfo({ phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={resume.location}
                onChange={(e) =>
                  updateBasicInfo({ location: e.target.value })
                }
                placeholder="New York, USA"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Profile Photo Upload */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">Professional Photo (Optional)</h3>
              <PhotoUpload
                onPhotoSelect={(photo) => setProfilePhoto(photo)}
                onPhotoRemove={() => removeProfilePhoto()}
              />
            </div>
          </motion.div>
        );

      case 'profession':
        return (
          <motion.div
            key="profession"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Current Job Title *
              </label>
              <input
                type="text"
                value={resume.profession || ''}
                onChange={(e) =>
                  updateProfession(e.target.value, resume.yearsExperience)
                }
                placeholder="e.g., Software Engineer, Marketing Manager"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Years of Experience *
              </label>
              <select
                value={resume.yearsExperience}
                onChange={(e) =>
                  updateProfession(
                    resume.profession || '',
                    parseInt(e.target.value)
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Select experience level</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((years) => (
                  <option key={years} value={years}>
                    {years} {years === 1 ? 'year' : 'years'}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        );

      case 'objective':
        return (
          <motion.div
            key="objective"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ConversationalInput
              section="Career Objective"
              profession={resume.profession || 'Professional'}
              onContentGenerated={(content) => {
                updateCareerObjective(content.variations[0] || '');
                toast.success('Career objective added!');
              }}
              isLoading={isLoading}
            />
          </motion.div>
        );

      case 'skills':
        return (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const skills = await api.generateSkills(
                    resume.profession || 'Professional',
                    resume.yearsExperience,
                    'General'
                  );
                  updateSkills(skills);
                  toast.success('Skills generated!');
                } catch (error) {
                  toast.error('Failed to generate skills');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {isLoading ? 'Generating...' : 'Generate Skills with AI'}
            </button>

            <SkillManagement
              technical={resume.skills.technical}
              soft={resume.skills.soft}
              industrySpecific={resume.skills.industrySpecific}
              onAdd={(category, skill) => addSkill(category, skill)}
              onRemove={(category, skill) => removeSkill(category, skill)}
            />
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div
            key="experience"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.button
              onClick={() => setIsExperienceEditorOpen(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
            >
              Manage Work Experience
            </motion.button>

            {resume.experience.length > 0 && (
              <div className="mt-6 space-y-3">
                {resume.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <h3 className="font-semibold">{exp.jobTitle}</h3>
                    <p className="text-sm text-gray-600">
                      {exp.company} • {exp.duration}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <ExperienceEditor
              isOpen={isExperienceEditorOpen}
              onClose={() => setIsExperienceEditorOpen(false)}
            />
          </motion.div>
        );

      case 'projects':
        return (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MultiEntryForm
              title="Projects"
              fields={[
                { name: 'name', label: 'Project Name', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
                { name: 'technologies', label: 'Technologies (comma-separated)', type: 'text', required: false },
                { name: 'link', label: 'Project Link (Optional)', type: 'text', required: false },
              ]}
              entries={resume.projects || []}
              onAdd={(entry: any) => {
                const techStr = (entry.technologies as string) || '';
                const technologies = techStr.split(',').map((t: string) => t.trim()).filter((t: string) => t);
                addProject({
                  id: uuidv4(),
                  name: entry.name as string,
                  description: entry.description as string,
                  technologies,
                  link: entry.link as string | undefined,
                });
              }}
              onUpdate={(id, entry: any) => {
                const techStr = (entry.technologies as string) || '';
                const technologies = techStr.split(',').map((t: string) => t.trim()).filter((t: string) => t);
                updateProject(id, {
                  id,
                  name: entry.name as string,
                  description: entry.description as string,
                  technologies,
                  link: entry.link as string | undefined,
                });
              }}
              onRemove={removeProject}
              displayFormat={(project) => project.name}
            />
          </motion.div>
        );

      case 'education':
        return (
          <motion.div
            key="education"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MultiEntryForm
              title="Education"
              fields={[
                { name: 'degree', label: 'Degree', type: 'text', required: true },
                { name: 'institution', label: 'Institution', type: 'text', required: true },
                { name: 'year', label: 'Graduation Year (Optional)', type: 'text', required: false },
                { name: 'details', label: 'Additional Details', type: 'textarea', required: false },
              ]}
              entries={resume.education}
              onAdd={(entry) => addEducation({
                id: uuidv4(),
                degree: entry.degree as string,
                institution: entry.institution as string,
                year: entry.year as string,
                details: entry.details as string | undefined,
              })}
              onUpdate={(id, entry) => updateEducation(id, {
                id,
                degree: entry.degree as string,
                institution: entry.institution as string,
                year: entry.year as string,
                details: entry.details as string | undefined,
              })}
              onRemove={removeEducation}
              displayFormat={(edu) => `${edu.degree} - ${edu.institution}`}
            />
          </motion.div>
        );

      case 'certifications':
        return (
          <motion.div
            key="certifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MultiEntryForm
              title="Certifications"
              fields={[
                { name: 'name', label: 'Certification Name', type: 'text', required: true },
                { name: 'issuer', label: 'Issuing Organization', type: 'text', required: true },
                { name: 'date', label: 'Date Obtained', type: 'text', required: false },
              ]}
              entries={resume.certifications}
              onAdd={(entry) => addCertification({
                id: uuidv4(),
                name: entry.name as string,
                issuer: entry.issuer as string,
                date: entry.date as string,
              })}
              onUpdate={(id, entry) => updateCertification(id, {
                id,
                name: entry.name as string,
                issuer: entry.issuer as string,
                date: entry.date as string,
              })}
              onRemove={removeCertification}
              displayFormat={(cert) => `${cert.name} - ${cert.issuer}`}
            />
          </motion.div>
        );

      case 'awards':
        return (
          <motion.div
            key="awards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MultiEntryForm
              title="Awards & Recognition"
              fields={[
                { name: 'title', label: 'Award Title', type: 'text', required: true },
                { name: 'organization', label: 'Organization', type: 'text', required: true },
                { name: 'date', label: 'Date', type: 'text', required: false },
                { name: 'description', label: 'Description', type: 'textarea', required: false },
              ]}
              entries={resume.awards || []}
              onAdd={(entry: any) => addAward({
                id: uuidv4(),
                title: entry.title as string,
                organization: entry.organization as string,
                date: (entry.date as string) || '',
                description: entry.description as string | undefined,
              })}
              onUpdate={(id, entry: any) => updateAward(id, {
                id,
                title: entry.title as string,
                organization: entry.organization as string,
                date: (entry.date as string) || '',
                description: entry.description as string | undefined,
              })}
              onRemove={removeAward}
              displayFormat={(award) => `${award.title} - ${award.organization}`}
            />
          </motion.div>
        );

      case 'socials':
        return (
          <motion.div
            key="socials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MultiEntryForm
              title="Social Links & Online Presence"
              fields={[
                {
                  name: 'platform',
                  label: 'Platform',
                  type: 'select',
                  options: [
                    { value: 'LinkedIn', label: 'LinkedIn' },
                    { value: 'GitHub', label: 'GitHub' },
                    { value: 'Portfolio', label: 'Portfolio' },
                    { value: 'Twitter', label: 'Twitter' },
                    { value: 'Website', label: 'Website' },
                    { value: 'Other', label: 'Other' },
                  ],
                  required: true,
                },
                { name: 'url', label: 'URL', type: 'text', required: true },
              ]}
              entries={resume.socialLinks || []}
              onAdd={(entry) => addSocialLink({
                id: uuidv4(),
                platform: entry.platform as string,
                url: entry.url as string,
              })}
              onUpdate={(id, entry) => updateSocialLink(id, {
                id,
                platform: entry.platform as string,
                url: entry.url as string,
              })}
              onRemove={removeSocialLink}
              displayFormat={(link) => `${link.platform}`}
            />
          </motion.div>
        );

      case 'languages':
        return (
          <motion.div
            key="languages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MultiEntryForm
              title="Languages"
              fields={[
                { name: 'language', label: 'Language', type: 'text', required: true },
                {
                  name: 'proficiency',
                  label: 'Proficiency',
                  type: 'select',
                  options: [
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                    { value: 'Fluent', label: 'Fluent' },
                    { value: 'Native', label: 'Native' },
                  ],
                  required: true,
                },
              ]}
              entries={resume.languages || []}
              onAdd={(entry) => addLanguage({
                id: uuidv4(),
                language: entry.language as string,
                proficiency: entry.proficiency as string,
              })}
              onUpdate={(id, entry) => updateLanguage(id, {
                id,
                language: entry.language as string,
                proficiency: entry.proficiency as string,
              })}
              onRemove={removeLanguage}
              displayFormat={(lang) => `${lang.language} - ${lang.proficiency}`}
            />
          </motion.div>
        );

      case 'preview':
        return (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Your resume is ready! Review it below and export when satisfied.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <TemplateRenderer
                resume={resume}
                templateId={resume.templateId}
              />
            </div>

            <motion.button
              onClick={() => setIsExportModalOpen(true)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <FiDownload /> Download Resume
            </motion.button>

            <ExportModal
              resume={resume}
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <StepIndicator
        steps={STEPS.map((s) => s.label)}
        currentStep={currentStepIdx}
        onStepClick={(idx) => setCurrentStepIdx(idx)}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {currentStep.title}
            </h2>

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              <motion.button
                onClick={handleBack}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiArrowLeft /> Back
              </motion.button>

              {currentStepIdx < STEPS.length - 1 && (
                <motion.button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next <FiArrowRight />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Preview Section */}
          {currentStepIdx !== STEPS.length - 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block bg-white rounded-lg shadow-lg p-8 sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Resume Preview
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <TemplateRenderer
                  resume={resume}
                  templateId={resume.templateId}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
