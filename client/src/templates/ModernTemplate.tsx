import React from 'react';
import { ResumeData } from '../store/resumeStore';
import { getFontSizePixels, getLineSpacing } from '../utils/textOptimization';

interface ModernTemplateProps {
  resume: ResumeData;
  isEditable?: boolean;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({
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
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Header with Photo */}
      <div className="border-b-2 pb-4 mb-6 flex gap-6" style={{ borderColor: primaryColor }}>
        {/* Profile Info */}
        <div className="flex-1">
          <h1
            className="text-4xl font-bold mb-1"
            style={{ color: primaryColor }}
          >
            {resume.fullName || 'Your Name'}
          </h1>
          <p className="text-gray-600 text-sm mb-2">
            {resume.profession && <span>{resume.profession}</span>}
          </p>
          <p className="text-gray-600 text-sm">
            {[resume.email, resume.phone, resume.location]
              .filter(Boolean)
              .join(' • ')}
          </p>
          {/* Social Links in Header */}
          {resume.socialLinks && resume.socialLinks.length > 0 && (
            <p className="text-gray-600 text-xs mt-2">
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
              className="w-40 h-52 object-cover rounded-lg border-2"
              style={{ borderColor: primaryColor, opacity: 0.95 }}
            />
          </div>
        )}
      </div>

      {/* Career Objective */}
      {resume.careerObjective && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-2 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Career Objective
          </h2>
          <p className="text-gray-700">{resume.careerObjective}</p>
        </div>
      )}

      {/* Skills */}
      {(resume.skills.technical.length > 0 ||
        resume.skills.soft.length > 0 ||
        resume.skills.industrySpecific.length > 0) && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Skills
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {resume.skills.technical.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm">Technical</h3>
                <ul className="space-y-1">
                  {resume.skills.technical.map((skill, idx) => (
                    <li key={idx} className="text-gray-700 text-sm">
                      • {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {resume.skills.soft.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm">Soft Skills</h3>
                <ul className="space-y-1">
                  {resume.skills.soft.map((skill, idx) => (
                    <li key={idx} className="text-gray-700 text-sm">
                      • {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {resume.skills.industrySpecific.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm">Industry</h3>
                <ul className="space-y-1">
                  {resume.skills.industrySpecific.map((skill, idx) => (
                    <li key={idx} className="text-gray-700 text-sm">
                      • {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Professional Experience
          </h2>
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm">{exp.jobTitle}</h3>
                <span className="text-gray-600 text-xs">{exp.duration}</span>
              </div>
              <p className="text-gray-600 text-xs font-semibold mb-2">
                {exp.company}
              </p>
              <ul className="space-y-1">
                {exp.description.map((desc, didx) => (
                  <li key={didx} className="text-gray-700 text-xs">
                    • {desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Projects
          </h2>
          {resume.projects.map((project, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm">{project.name}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    className="text-blue-600 text-xs underline"
                  >
                    Link
                  </a>
                )}
              </div>
              <p className="text-gray-700 text-xs mb-1">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-gray-600 text-xs">
                  <span className="font-semibold">Tech:</span>{' '}
                  {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Education
          </h2>
          {resume.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm">{edu.degree}</h3>
                <span className="text-gray-600 text-xs">{edu.year}</span>
              </div>
              <p className="text-gray-600 text-xs">{edu.institution}</p>
              {edu.details && (
                <p className="text-gray-700 text-xs mt-1">{edu.details}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Certifications
          </h2>
          <ul className="space-y-2">
            {resume.certifications.map((cert, idx) => (
              <li key={idx} className="text-gray-700 text-xs">
                <span className="font-semibold">{cert.name}</span>
                <span className="text-gray-600"> • {cert.issuer}</span>
                {cert.date && (
                  <span className="text-gray-600"> • {cert.date}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Awards */}
      {resume.awards && resume.awards.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Awards & Recognition
          </h2>
          <ul className="space-y-2">
            {resume.awards.map((award, idx) => (
              <li key={idx} className="text-gray-700 text-xs">
                <span className="font-semibold">{award.title}</span>
                <span className="text-gray-600"> • {award.organization}</span>
                {award.date && (
                  <span className="text-gray-600"> • {award.date}</span>
                )}
                {award.description && (
                  <p className="text-gray-600 text-xs mt-1">
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
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Languages
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {resume.languages.map((lang, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-semibold">{lang.language}</span>
                <span className="text-gray-600"> • {lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
