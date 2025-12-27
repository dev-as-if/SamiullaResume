import React from 'react';
import { ResumeData } from '../store/resumeStore';
import { getFontSizePixels, getLineSpacing } from '../utils/textOptimization';

interface ProfessionalTemplateProps {
  resume: ResumeData;
  isEditable?: boolean;
}

export const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({
  resume,
  isEditable = false,
}) => {
  const primaryColor = resume.theme.primaryColor;
  const fontSizePixels = getFontSizePixels('body', resume.theme.fontSize);
  const lineSpacingMultiplier = getLineSpacing(resume.theme.lineSpacing);

  return (
    <div
      className="bg-white p-12 max-w-4xl mx-auto"
      style={{
        fontSize: `${fontSizePixels}pt`,
        lineHeight: lineSpacingMultiplier,
        fontFamily: 'Calibri, sans-serif',
      }}
    >
      {/* Header with Photo */}
      <div className="mb-6 flex gap-6">
        {/* Profile Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1 text-gray-900">
            {resume.fullName || 'Your Name'}
          </h1>
          {resume.profession && (
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {resume.profession}
            </p>
          )}
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            {resume.email && <span>{resume.email}</span>}
            {resume.phone && <span>|</span>}
            {resume.phone && <span>{resume.phone}</span>}
            {resume.location && <span>|</span>}
            {resume.location && <span>{resume.location}</span>}
          </div>
          {/* Social Links */}
          {resume.socialLinks && resume.socialLinks.length > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              {resume.socialLinks.map((link, idx) => (
                <span key={idx}>
                  {link.platform}: {link.url}
                  {idx < resume.socialLinks.length - 1 && ' • '}
                </span>
              ))}
            </p>
          )}
        </div>

        {/* Profile Photo */}
        {resume.profilePhoto && (
          <div className="flex-shrink-0">
            <img
              src={resume.profilePhoto}
              alt="Profile"
              className="w-40 h-52 object-cover rounded-lg border border-gray-300"
              style={{ opacity: 0.95 }}
            />
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* Career Objective */}
      {resume.careerObjective && (
        <div className="mb-5">
          <h2 className="text-lg font-bold mb-2 text-gray-900">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 text-xs">{resume.careerObjective}</p>
        </div>
      )}

      {/* Skills */}
      {(resume.skills.technical.length > 0 ||
        resume.skills.soft.length > 0 ||
        resume.skills.industrySpecific.length > 0) && (
        <div className="mb-5">
          <h2 className="text-lg font-bold mb-2 text-gray-900">SKILLS</h2>
          <div className="text-xs text-gray-700 space-y-1">
            {resume.skills.technical.length > 0 && (
              <p>
                <strong>Technical:</strong>{' '}
                {resume.skills.technical.join(', ')}
              </p>
            )}
            {resume.skills.soft.length > 0 && (
              <p>
                <strong>Soft Skills:</strong> {resume.skills.soft.join(', ')}
              </p>
            )}
            {resume.skills.industrySpecific.length > 0 && (
              <p>
                <strong>Industry Specific:</strong>{' '}
                {resume.skills.industrySpecific.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold mb-2 text-gray-900">
            PROFESSIONAL EXPERIENCE
          </h2>
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-xs">{exp.jobTitle}</h3>
                  <p className="text-xs text-gray-600">{exp.company}</p>
                </div>
                <span className="text-xs text-gray-600">{exp.duration}</span>
              </div>
              <ul className="text-xs text-gray-700 mt-1 space-y-1 ml-4">
                {exp.description.map((desc, didx) => (
                  <li key={didx}>• {desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold mb-2 text-gray-900">PROJECTS</h2>
          {resume.projects.map((project, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xs">{project.name}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    className="text-blue-600 text-xs underline"
                  >
                    Link
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-700">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  <strong>Tech:</strong> {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold mb-2 text-gray-900">EDUCATION</h2>
          {resume.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-xs">{edu.degree}</h3>
                  <p className="text-xs text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-xs text-gray-600">{edu.year}</span>
              </div>
              {edu.details && (
                <p className="text-xs text-gray-700 mt-1">{edu.details}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold mb-2 text-gray-900">
            CERTIFICATIONS
          </h2>
          <ul className="text-xs text-gray-700 space-y-1">
            {resume.certifications.map((cert, idx) => (
              <li key={idx}>
                <strong>{cert.name}</strong> - {cert.issuer}
                {cert.date && <span> ({cert.date})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Awards */}
      {resume.awards && resume.awards.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold mb-2 text-gray-900">
            AWARDS & RECOGNITION
          </h2>
          <ul className="text-xs text-gray-700 space-y-1">
            {resume.awards.map((award, idx) => (
              <li key={idx}>
                <strong>{award.title}</strong> - {award.organization}
                {award.date && <span> ({award.date})</span>}
                {award.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {award.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold mb-2 text-gray-900">LANGUAGES</h2>
          <ul className="text-xs text-gray-700 space-y-1">
            {resume.languages.map((lang, idx) => (
              <li key={idx}>
                <strong>{lang.language}</strong> - {lang.proficiency}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
