import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface SkillTagProps {
  skill: string;
  category: 'technical' | 'soft' | 'industrySpecific';
  onRemove: (category: 'technical' | 'soft' | 'industrySpecific', skill: string) => void;
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, category, onRemove }) => {
  const categoryColors = {
    technical: 'bg-blue-100 text-blue-800 border-blue-300',
    soft: 'bg-purple-100 text-purple-800 border-purple-300',
    industrySpecific: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${categoryColors[category]}`}
    >
      <span className="text-sm font-medium">{skill}</span>
      <button
        onClick={() => onRemove(category, skill)}
        className="hover:opacity-70 transition-opacity"
        title="Remove skill"
      >
        <FiX size={14} />
      </button>
    </motion.div>
  );
};

interface SkillManagementProps {
  technical: string[];
  soft: string[];
  industrySpecific: string[];
  onAdd: (category: 'technical' | 'soft' | 'industrySpecific', skill: string) => void;
  onRemove: (category: 'technical' | 'soft' | 'industrySpecific', skill: string) => void;
}

export const SkillManagement: React.FC<SkillManagementProps> = ({
  technical,
  soft,
  industrySpecific,
  onAdd,
  onRemove,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'technical' | 'soft' | 'industrySpecific'>(
    'technical'
  );
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const skills = {
    technical,
    soft,
    industrySpecific,
  };

  const categoryLabels = {
    technical: 'Technical Skills',
    soft: 'Soft Skills',
    industrySpecific: 'Industry-Specific',
  };

  const categoryIcons = {
    technical: '💻',
    soft: '🤝',
    industrySpecific: '🎯',
  };

  const handleAddSkill = () => {
    const skill = inputValue.trim();

    if (!skill) {
      toast.error('Please enter a skill');
      return;
    }

    if (skills[selectedCategory].includes(skill)) {
      toast.error('This skill already exists');
      return;
    }

    if (skill.length > 50) {
      toast.error('Skill must be less than 50 characters');
      return;
    }

    onAdd(selectedCategory, skill);
    setInputValue('');
    toast.success(`Added "${skill}" to ${categoryLabels[selectedCategory]}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const totalSkills = technical.length + soft.length + industrySpecific.length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900">
          📊 {totalSkills} skill{totalSkills !== 1 ? 's' : ''} added
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(Object.entries(categoryLabels) as Array<[typeof selectedCategory, string]>).map(
          ([cat, label]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pb-2 px-3 font-medium text-sm transition-all ${
                selectedCategory === cat
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {categoryIcons[cat]} {label}
            </button>
          )
        )}
      </div>

      {/* Input Section */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Add a ${categoryLabels[selectedCategory].toLowerCase()}...`}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddSkill}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <FiPlus size={18} />
          Add
        </button>
      </div>

      {/* Suggestions for first time */}
      {totalSkills === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-900">
            💡 Tip: Add skills that match your job title and industry for better ATS compatibility
          </p>
        </div>
      )}

      {/* Skills Display */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {skills[selectedCategory].length > 0 ? (
            <motion.div
              layout
              className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg"
            >
              {skills[selectedCategory].map((skill) => (
                <SkillTag
                  key={skill}
                  skill={skill}
                  category={selectedCategory}
                  onRemove={onRemove}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg"
            >
              <p className="text-sm">No {categoryLabels[selectedCategory].toLowerCase()} added yet</p>
              <p className="text-xs mt-1">Start typing and hit Enter or click Add</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Add Suggestions */}
      {skills[selectedCategory].length === 0 && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium text-gray-600">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategory === 'technical' &&
              ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python'].map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    onAdd(selectedCategory, skill);
                    toast.success(`Added "${skill}"`);
                  }}
                  className="text-xs bg-white border border-gray-300 hover:border-blue-500 px-2 py-1 rounded transition-colors"
                >
                  + {skill}
                </button>
              ))}
            {selectedCategory === 'soft' &&
              ['Communication', 'Leadership', 'Problem Solving', 'Time Management'].map(
                (skill) => (
                  <button
                    key={skill}
                    onClick={() => {
                      onAdd(selectedCategory, skill);
                      toast.success(`Added "${skill}"`);
                    }}
                    className="text-xs bg-white border border-gray-300 hover:border-blue-500 px-2 py-1 rounded transition-colors"
                  >
                    + {skill}
                  </button>
                )
              )}
            {selectedCategory === 'industrySpecific' &&
              ['Agile', 'Scrum', 'DevOps', 'Cloud Architecture'].map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    onAdd(selectedCategory, skill);
                    toast.success(`Added "${skill}"`);
                  }}
                  className="text-xs bg-white border border-gray-300 hover:border-blue-500 px-2 py-1 rounded transition-colors"
                >
                  + {skill}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillManagement;
