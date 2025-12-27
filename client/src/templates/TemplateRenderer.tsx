import React from 'react';
import ModernTemplate from './ModernTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import { ResumeData } from '../store/resumeStore';

interface TemplateRendererProps {
  resume: ResumeData;
  templateId: string;
  isEditable?: boolean;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  resume,
  templateId,
  isEditable = false,
}) => {
  switch (templateId) {
    case 'modern':
      return <ModernTemplate resume={resume} isEditable={isEditable} />;
    case 'professional':
      return <ProfessionalTemplate resume={resume} isEditable={isEditable} />;
    default:
      return <ModernTemplate resume={resume} isEditable={isEditable} />;
  }
};

export default TemplateRenderer;
