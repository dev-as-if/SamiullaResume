import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiEdit2, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as api from '../utils/api';

interface ConversationalInputProps {
  section: string;
  profession: string;
  onContentGenerated: (content: any) => void;
  isLoading?: boolean;
}

type InputType = 'text' | 'multiline' | 'mcq';

interface InputStep {
  id: string;
  type: InputType;
  question: string;
  options?: string[];
  value?: string;
  isAnswered: boolean;
}

export const ConversationalInput: React.FC<ConversationalInputProps> = ({
  section,
  profession,
  onContentGenerated,
  isLoading: externalLoading = false,
}) => {
  const [inputSteps, setInputSteps] = useState<InputStep[]>([
    {
      id: 'main',
      type: 'multiline',
      question: `Tell me about your ${section.toLowerCase()}. Provide as much detail as possible.`,
      value: '',
      isAnswered: false,
    },
  ]);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [variations, setVariations] = useState<any>(null);

  const currentStep = inputSteps[currentStepIdx];

  const handleInputChange = (value: string) => {
    const updatedSteps = [...inputSteps];
    updatedSteps[currentStepIdx] = {
      ...updatedSteps[currentStepIdx],
      value,
    };
    setInputSteps(updatedSteps);
  };

  const handleNext = async () => {
    if (!currentStep.value?.trim()) {
      toast.error('Please provide an answer before proceeding');
      return;
    }

    const updatedSteps = [...inputSteps];
    updatedSteps[currentStepIdx].isAnswered = true;
    setInputSteps(updatedSteps);

    if (currentStepIdx < inputSteps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      // Generate content
      await generateContent();
    }
  };

  const generateContent = async () => {
    try {
      setIsLoading(true);
      const userInput = currentStep.value || '';

      const response = await api.generateResumeSection(
        profession,
        section,
        userInput
      );

      setVariations(response);
      setShowVariations(true);
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVariation = (variation: string) => {
    onContentGenerated({
      section,
      content: variation,
      variations: variations?.variations || [],
      suggestions: variations?.suggestions || [],
    });
    toast.success('Content selected!');
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!showVariations ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentStep.question}
              </h3>
              <p className="text-sm text-gray-600">
                Step {currentStepIdx + 1} of {inputSteps.length}
              </p>
            </div>

            {currentStep.type === 'multiline' ? (
              <textarea
                value={currentStep.value || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter your response here..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            ) : currentStep.type === 'mcq' && currentStep.options ? (
              <div className="space-y-2">
                {currentStep.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleInputChange(option)}
                    className={`w-full p-3 text-left border-2 rounded-lg transition-all ${
                      currentStep.value === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={currentStep.value || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter your response here..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            <motion.button
              onClick={handleNext}
              disabled={isLoading || externalLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>
                {currentStepIdx === inputSteps.length - 1
                  ? 'Generate Content'
                  : 'Next'}
              </span>
              <FiSend />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="variations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start gap-3">
              <FiCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-green-900">Success!</p>
                <p className="text-sm text-green-700">
                  Here are content variations for your {section}. Select one or
                  generate new ones.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {variations?.variations?.map((variation: string, idx: number) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSelectVariation(variation)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-gray-700 group-hover:text-blue-700 transition-colors">
                      {variation}
                    </p>
                    <motion.div
                      className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.2 }}
                    >
                      <FiCheckCircle className="text-xl" />
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </div>

            {variations?.suggestions && variations.suggestions.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="font-semibold text-yellow-900 mb-2">Suggestions:</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {variations.suggestions.map((sugg: string, idx: number) => (
                    <li key={idx}>• {sugg}</li>
                  ))}
                </ul>
              </div>
            )}

            <motion.button
              onClick={() => {
                setShowVariations(false);
                setCurrentStepIdx(0);
                setInputSteps((prev) =>
                  prev.map((step) => ({ ...step, isAnswered: false, value: '' }))
                );
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiEdit2 />
              Generate Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConversationalInput;
