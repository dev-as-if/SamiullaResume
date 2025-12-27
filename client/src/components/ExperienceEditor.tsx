import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPlus, FiEdit2, FiTrash2, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useResumeStore, ResumeData } from '../store/resumeStore';
import { v4 as uuidv4 } from 'uuid';

interface ExperienceEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  isOpen,
  onClose,
}) => {
  const { resume, addExperience, updateExperience, removeExperience } =
    useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    jobTitle: '',
    company: '',
    duration: '',
    description: [''],
  });

  const handleAddExperience = () => {
    if (!formData.jobTitle || !formData.company || !formData.duration) {
      toast.error('Please fill in all required fields');
      return;
    }

    const experience = {
      ...formData,
      id: formData.id || uuidv4(),
      description: formData.description.filter((d) => d.trim()),
    };

    if (formData.id) {
      updateExperience(formData.id, experience);
      toast.success('Experience updated!');
    } else {
      addExperience(experience);
      toast.success('Experience added!');
    }

    setFormData({
      id: '',
      jobTitle: '',
      company: '',
      duration: '',
      description: [''],
    });
    setIsAdding(false);
  };

  const handleGetAISuggestions = async () => {
    if (!formData.jobTitle) {
      toast.error('Please enter a job title first');
      return;
    }

    try {
      setIsLoadingSuggestions(true);
      console.log('[ExperienceEditor] Requesting AI suggestions for:', formData.jobTitle);
      
      const requestBody = {
        profession: formData.jobTitle,
        jobTitle: formData.jobTitle,
        context: {
          company: formData.company || 'Company',
          yearsExperience: resume.yearsExperience || 0,
          skills: [
            ...resume.skills.technical,
            ...resume.skills.soft,
            ...resume.skills.industrySpecific,
          ],
          industry: 'Technology',
          department: 'Engineering',
        },
      };
      
      console.log('[ExperienceEditor] Request body:', JSON.stringify(requestBody));
      
      const response = await fetch(
        'http://localhost:5000/api/ai/generate/role-responsibilities',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      console.log('[ExperienceEditor] Response status:', response.status);
      console.log('[ExperienceEditor] Response headers:', {
        contentType: response.headers.get('content-type'),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to get suggestions';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('[ExperienceEditor] Server error:', errorData);
        } catch (e) {
          const text = await response.text();
          console.error('[ExperienceEditor] Error response:', text);
        }
        throw new Error(`Server error (${response.status}): ${errorMessage}`);
      }

      const data = await response.json();
      console.log('[ExperienceEditor] Received response:', data);
      
      // Add suggestions to the description - handle variations as either array or string
      let suggestions = data.variations || [];
      if (typeof suggestions === 'string') {
        suggestions = [suggestions];
      }
      
      if (!Array.isArray(suggestions)) {
        suggestions = Object.values(suggestions as object).filter(v => typeof v === 'string');
      }
      
      const validSuggestions = suggestions.filter((s: string) => s && typeof s === 'string');
      
      if (validSuggestions.length === 0) {
        toast.error('No suggestions were generated. Please try again.');
        setIsLoadingSuggestions(false);
        return;
      }
      
      const newDescriptions = [
        ...formData.description.filter((d) => d.trim()),
        ...validSuggestions.slice(0, 5),
      ];

      setFormData({
        ...formData,
        description: newDescriptions,
      });

      toast.success(`AI generated ${validSuggestions.length} suggestions! You can edit or remove any of them.`);
      console.log('[ExperienceEditor] Successfully added suggestions');
    } catch (error) {
      console.error('[ExperienceEditor] Error getting suggestions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI suggestions. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleEditExperience = (exp: (typeof resume.experience)[0]) => {
    setFormData(exp);
    setIsAdding(true);
  };

  const handleAddDescription = () => {
    setFormData({
      ...formData,
      description: [...formData.description, ''],
    });
  };

  const handleDescriptionChange = (idx: number, value: string) => {
    const newDescription = [...formData.description];
    newDescription[idx] = value;
    setFormData({ ...formData, description: newDescription });
  };

  const handleRemoveDescription = (idx: number) => {
    setFormData({
      ...formData,
      description: formData.description.filter((_, i) => i !== idx),
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Professional Experience</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {!isAdding ? (
          <div>
            <div className="space-y-3 mb-4">
              {resume.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {exp.company} • {exp.duration}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditExperience(exp)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => {
                          removeExperience(exp.id);
                          toast.success('Experience removed');
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              onClick={() => setIsAdding(true)}
              className="w-full py-2 border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg text-gray-600 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <FiPlus /> Add Experience
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., TechCorp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Jan 2020 - Dec 2021"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Responsibilities
                </label>
                <motion.button
                  onClick={handleGetAISuggestions}
                  disabled={isLoadingSuggestions || !formData.jobTitle}
                  className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <FiZap className="text-sm" />
                  {isLoadingSuggestions ? 'Getting...' : 'AI Suggestions'}
                </motion.button>
              </div>

              {formData.description.map((desc, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) =>
                      handleDescriptionChange(idx, e.target.value)
                    }
                    placeholder="Add a responsibility..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleRemoveDescription(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddDescription}
                className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-2"
              >
                <FiPlus className="text-sm" /> Add Responsibility
              </button>
            </div>

            <div className="flex gap-2 pt-4">
              <motion.button
                onClick={handleAddExperience}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                {formData.id ? 'Update' : 'Add'} Experience
              </motion.button>
              <motion.button
                onClick={() => {
                  setIsAdding(false);
                  setFormData({
                    id: '',
                    jobTitle: '',
                    company: '',
                    duration: '',
                    description: [''],
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExperienceEditor;
