import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronRight, FiCheck } from 'react-icons/fi';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full py-8 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <motion.button
                onClick={() => onStepClick?.(idx)}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                  idx < currentStep
                    ? 'bg-green-500 text-white cursor-pointer'
                    : idx === currentStep
                    ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                    : 'bg-gray-200 text-gray-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {idx < currentStep ? (
                  <FiCheck className="text-lg" />
                ) : (
                  idx + 1
                )}
              </motion.button>

              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    idx <= currentStep ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {step}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <motion.div
                  className={`flex-1 h-1 mx-4 rounded-full transition-colors ${
                    idx < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  layoutId={`line-${idx}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
