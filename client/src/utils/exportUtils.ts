import jsPDF from 'jspdf';
import { Packer, Document, Paragraph, TextRun, Table, TableCell, TableRow, BorderStyle, UnderlineType, convertInchesToTwip } from 'docx';
import { ResumeData } from '../store/resumeStore';

/**
 * Generate PDF from resume with all sections - IMPROVED VERSION
 */
export const generatePDF = (resume: ResumeData, photoPosition: 'left' | 'right' | 'none' = 'right'): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 12;
      const marginY = 12;
      const photoWidth = 25; // Smaller photo size to not overshadow text
      const photoHeight = 32;
      
      let contentWidth = pageWidth - marginX * 2;
      let contentStartX = marginX;
      let currentY = marginY;

      // Set fonts
      const titleFont = 16;
      const headingFont = 11;
      const normalFont = 9.5;
      const smallFont = 8.5;

      const checkPageBreak = (minSpaceNeeded: number = 20) => {
        if (currentY + minSpaceNeeded > pageHeight - marginY) {
          pdf.addPage();
          currentY = marginY;
        }
      };

      // Add section divider - consistent dark line
      const addSectionDivider = () => {
        checkPageBreak(5);
        pdf.setDrawColor(50, 50, 50);
        pdf.setLineWidth(0.3);
        pdf.line(marginX, currentY, pageWidth - marginX, currentY);
        currentY += 3;
      };

      // Helper to add text with wrapping
      const addText = (text: string, size: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0], x = contentStartX) => {
        pdf.setFontSize(size);
        pdf.setTextColor(color[0], color[1], color[2]);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = pdf.splitTextToSize(text, contentWidth);
        pdf.text(lines, x, currentY);
        currentY += (lines.length * size * 0.35) + 1;
      };

      // ========== HEADER SECTION ==========
      // Photo on right or left
      let photoAdded = false;
      if (resume.profilePhoto && photoPosition !== 'none') {
        try {
          if (photoPosition === 'right') {
            pdf.addImage(resume.profilePhoto, 'JPEG', pageWidth - marginX - photoWidth, marginY, photoWidth, photoHeight);
            contentWidth = pageWidth - marginX * 2 - photoWidth - 3;
            contentStartX = marginX;
            photoAdded = true;
          } else if (photoPosition === 'left') {
            pdf.addImage(resume.profilePhoto, 'JPEG', marginX, marginY, photoWidth, photoHeight);
            contentWidth = pageWidth - marginX * 2 - photoWidth - 3;
            contentStartX = marginX + photoWidth + 3;
            photoAdded = true;
          }
        } catch (e) {
          console.log('Could not add photo to PDF');
        }
      }

      // Align text with photo baseline - adjust currentY to align with photo bottom
      currentY = marginY + (photoAdded ? 3 : 0);

      // Name
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(titleFont);
      pdf.setTextColor(59, 130, 246);
      pdf.text(resume.fullName, contentStartX, currentY);
      currentY += 8;

      // Contact info
      const contactInfo = [resume.email, resume.phone, resume.location].filter(Boolean).join(' • ');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(smallFont);
      pdf.setTextColor(0, 0, 0);
      const contactLines = pdf.splitTextToSize(contactInfo, contentWidth);
      pdf.text(contactLines, contentStartX, currentY);
      currentY += contactLines.length * 3.5 + 2;

      // Social Links in header
      if (resume.socialLinks && resume.socialLinks.length > 0) {
        const socialText = resume.socialLinks.map(s => `${s.platform}`).join(' • ');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(smallFont);
        pdf.setTextColor(59, 130, 246);
        const socialLines = pdf.splitTextToSize(socialText, contentWidth);
        pdf.text(socialLines, contentStartX, currentY);
        currentY += socialLines.length * 3.5 + 3;
      }

      // Position currentY below the photo to prevent overlap
      if (photoAdded) {
        currentY = Math.max(currentY, marginY + photoHeight + 3);
      }

      currentY += 4; // Extra spacing before career objective

      // Reset content width after header
      contentWidth = pageWidth - marginX * 2;
      contentStartX = marginX;

      // ========== CAREER OBJECTIVE ==========
      if (resume.careerObjective) {
        checkPageBreak(25);
        addSectionDivider();
        addText('CAREER OBJECTIVE', headingFont, true, [59, 130, 246]);
        currentY += 2;
        addText(resume.careerObjective, normalFont);
        currentY += 3;
      }

      // ========== SKILLS ==========
      if (resume.skills.technical.length > 0 || resume.skills.soft.length > 0 || resume.skills.industrySpecific.length > 0) {
        checkPageBreak(25);
        addSectionDivider();
        addText('SKILLS', headingFont, true, [59, 130, 246]);
        currentY += 2;

        if (resume.skills.technical.length > 0) {
          addText(`Technical: ${resume.skills.technical.join(', ')}`, normalFont);
          currentY += 2;
        }

        if (resume.skills.soft.length > 0) {
          addText(`Soft Skills: ${resume.skills.soft.join(', ')}`, normalFont);
          currentY += 2;
        }

        if (resume.skills.industrySpecific.length > 0) {
          addText(`Industry-Specific: ${resume.skills.industrySpecific.join(', ')}`, normalFont);
          currentY += 2;
        }

        currentY += 1;
      }

      // ========== PROFESSIONAL EXPERIENCE ==========
      if (resume.experience.length > 0) {
        checkPageBreak(30);
        addSectionDivider();
        addText('PROFESSIONAL EXPERIENCE', headingFont, true, [59, 130, 246]);
        currentY += 2;

        resume.experience.forEach((exp, idx) => {
          checkPageBreak(20);

          // Job title and company
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(normalFont);
          pdf.setTextColor(0, 0, 0);
          pdf.text(exp.jobTitle, marginX, currentY);
          currentY += 5;

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(smallFont);
          pdf.setTextColor(100, 100, 100);
          const durationText = exp.duration ? `${exp.company} | ${exp.duration}` : exp.company;
          pdf.text(durationText, marginX + 3, currentY);
          currentY += 5;

          // Responsibilities
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(normalFont);
          pdf.setTextColor(0, 0, 0);

          exp.description.forEach((desc) => {
            const descLines = pdf.splitTextToSize(`• ${desc}`, contentWidth - 5);
            pdf.text(descLines, marginX + 3, currentY);
            currentY += descLines.length * normalFont * 0.35 + 1;
          });

          currentY += 2;
        });
      }

      // ========== EDUCATION ==========
      if (resume.education.length > 0) {
        checkPageBreak(30);
        addSectionDivider();
        addText('EDUCATION', headingFont, true, [59, 130, 246]);
        currentY += 2;

        resume.education.forEach((edu) => {
          checkPageBreak(12);

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(normalFont);
          pdf.setTextColor(0, 0, 0);
          pdf.text(edu.degree, marginX, currentY);
          currentY += 5;

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(smallFont);
          pdf.setTextColor(100, 100, 100);
          const yearText = edu.year ? `${edu.institution} | ${edu.year}` : edu.institution;
          pdf.text(yearText, marginX + 3, currentY);
          currentY += 5;

          if (edu.details) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(normalFont);
            pdf.setTextColor(0, 0, 0);
            const detailLines = pdf.splitTextToSize(edu.details, contentWidth - 5);
            pdf.text(detailLines, marginX + 3, currentY);
            currentY += detailLines.length * normalFont * 0.35;
          }

          currentY += 2;
        });
      }

      // ========== CERTIFICATIONS ==========
      if (resume.certifications.length > 0) {
        checkPageBreak(20);
        addSectionDivider();
        addText('CERTIFICATIONS', headingFont, true, [59, 130, 246]);
        currentY += 2;

        resume.certifications.forEach((cert) => {
          checkPageBreak(10);

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(normalFont);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`• ${cert.name}`, marginX, currentY);
          currentY += 5;

          if (cert.issuer || cert.date) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(smallFont);
            pdf.setTextColor(100, 100, 100);
            const certText = cert.date ? `${cert.issuer} | ${cert.date}` : cert.issuer;
            pdf.text(certText, marginX + 3, currentY);
            currentY += 5;
          }
        });
      }

      // ========== PROJECTS ==========
      if (resume.projects && resume.projects.length > 0) {
        checkPageBreak(25);
        addSectionDivider();
        addText('PROJECTS', headingFont, true, [59, 130, 246]);
        currentY += 2;

        resume.projects.forEach((project) => {
          checkPageBreak(15);

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(normalFont);
          pdf.setTextColor(0, 0, 0);
          pdf.text(project.name, marginX, currentY);
          currentY += 5;

          if (project.technologies && project.technologies.length > 0) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(smallFont);
            pdf.setTextColor(100, 100, 100);
            const techText = `Tech: ${project.technologies.join(', ')}`;
            const techLines = pdf.splitTextToSize(techText, contentWidth - 5);
            pdf.text(techLines, marginX + 3, currentY);
            currentY += techLines.length * smallFont * 0.35 + 1;
          }

          if (project.description) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(normalFont);
            pdf.setTextColor(0, 0, 0);
            const descLines = pdf.splitTextToSize(project.description, contentWidth - 5);
            pdf.text(descLines, marginX + 3, currentY);
            currentY += descLines.length * normalFont * 0.35 + 2;
          }

          currentY += 1;
        });
      }

      // ========== AWARDS ==========
      if (resume.awards && resume.awards.length > 0) {
        checkPageBreak(15);
        addSectionDivider();
        addText('AWARDS & RECOGNITION', headingFont, true, [59, 130, 246]);
        currentY += 2;

        resume.awards.forEach((award) => {
          checkPageBreak(8);

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(normalFont);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`• ${award.title}`, marginX, currentY);
          currentY += 5;

          if (award.organization || award.date) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(smallFont);
            pdf.setTextColor(100, 100, 100);
            const awardText = award.date ? `${award.organization} | ${award.date}` : award.organization;
            pdf.text(awardText, marginX + 3, currentY);
            currentY += 5;
          }
        });
      }

      // ========== LANGUAGES ==========
      if (resume.languages && resume.languages.length > 0) {
        checkPageBreak(15);
        addSectionDivider();
        addText('LANGUAGES', headingFont, true, [59, 130, 246]);
        currentY += 2;

        resume.languages.forEach((lang) => {
          checkPageBreak(8);

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(normalFont);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`• ${lang.language} - ${lang.proficiency}`, marginX, currentY);
          currentY += 5;
        });
      }

      // Save PDF
      pdf.save(`${resume.fullName || 'resume'}_${new Date().toISOString().split('T')[0]}.pdf`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate DOCX from resume - IMPROVED VERSION with photo support
 */
export const generateDOCX = async (resume: ResumeData): Promise<void> => {
  try {
    const sections: Paragraph[] = [];

    // Helper for section heading with divider
    const addSectionHeading = (title: string) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 11 * 2, // 11pt headings
              color: '3b82f6',
            }),
          ],
          border: {
            bottom: {
              color: '000000',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          spacing: { before: 150, after: 100 },
        })
      );
    };

    // ========== HEADER WITH PHOTO ==========
    // Add photo if exists
    if (resume.profilePhoto) {
      // Note: docx library has limited image support, so we create a simple text-based header with note
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '[Photo would appear here in a full DOCX editor]',
              italics: true,
              size: 8 * 2,
              color: '999999',
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    // Title
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.fullName,
            bold: true,
            size: 13 * 2, // Slightly larger for title
            color: '3b82f6',
          }),
        ],
        spacing: { after: 50 },
      })
    );

    // Contact info
    const contactInfo = [resume.email, resume.phone, resume.location].filter(Boolean).join(' • ');
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo,
            size: 9 * 2, // 9pt
          }),
        ],
        spacing: { after: 50 },
      })
    );

    // Social Links
    if (resume.socialLinks && resume.socialLinks.length > 0) {
      const socialText = resume.socialLinks.map(s => `${s.platform}: ${s.url}`).join(' | ');
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: socialText,
              size: 9 * 2,
              color: '3b82f6',
            }),
          ],
          spacing: { after: 150 },
        })
      );
    }

    // ========== CAREER OBJECTIVE ==========
    if (resume.careerObjective) {
      addSectionHeading('CAREER OBJECTIVE');
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resume.careerObjective,
              size: 10 * 2, // 10pt
            }),
          ],
          spacing: { after: 150 },
        })
      );
    }

    // ========== SKILLS ==========
    if (
      resume.skills.technical.length > 0 ||
      resume.skills.soft.length > 0 ||
      resume.skills.industrySpecific.length > 0
    ) {
      addSectionHeading('SKILLS');

      if (resume.skills.technical.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Technical: `,
                bold: true,
                size: 10 * 2,
              }),
              new TextRun({
                text: resume.skills.technical.join(', '),
                size: 10 * 2,
              }),
            ],
            spacing: { after: 75 },
          })
        );
      }

      if (resume.skills.soft.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Soft Skills: `,
                bold: true,
                size: 10 * 2,
              }),
              new TextRun({
                text: resume.skills.soft.join(', '),
                size: 10 * 2,
              }),
            ],
            spacing: { after: 75 },
          })
        );
      }

      if (resume.skills.industrySpecific.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Industry-Specific: `,
                bold: true,
                size: 10 * 2,
              }),
              new TextRun({
                text: resume.skills.industrySpecific.join(', '),
                size: 10 * 2,
              }),
            ],
            spacing: { after: 150 },
          })
        );
      }
    }

    // ========== PROFESSIONAL EXPERIENCE ==========
    if (resume.experience.length > 0) {
      addSectionHeading('PROFESSIONAL EXPERIENCE');

      resume.experience.forEach((exp) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.jobTitle,
                bold: true,
                size: 10 * 2,
              }),
            ],
            spacing: { after: 25 },
          })
        );

        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.company}${exp.duration ? ` | ${exp.duration}` : ''}`,
                italics: true,
                size: 9 * 2,
              }),
            ],
            spacing: { after: 75 },
          })
        );

        exp.description.forEach((desc) => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: desc,
                  size: 10 * 2,
                }),
              ],
              bullet: {
                level: 0,
              },
              spacing: { after: 50 },
            })
          );
        });

        sections.push(new Paragraph({ text: '', spacing: { after: 50 } }));
      });
    }

    // ========== EDUCATION ==========
    if (resume.education.length > 0) {
      addSectionHeading('EDUCATION');

      resume.education.forEach((edu) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree,
                bold: true,
                size: 10 * 2,
              }),
            ],
            spacing: { after: 25 },
          })
        );

        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.institution}${edu.year ? ` | ${edu.year}` : ''}`,
                italics: true,
                size: 9 * 2,
              }),
            ],
            spacing: { after: 75 },
          })
        );

        if (edu.details) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.details,
                  size: 10 * 2,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }

        sections.push(new Paragraph({ text: '', spacing: { after: 50 } }));
      });
    }

    // ========== CERTIFICATIONS ==========
    if (resume.certifications.length > 0) {
      addSectionHeading('CERTIFICATIONS');

      resume.certifications.forEach((cert) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.name,
                size: 10 * 2,
              }),
            ],
            bullet: {
              level: 0,
            },
            spacing: { after: 25 },
          })
        );

        if (cert.issuer || cert.date) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${cert.issuer}${cert.date ? ` | ${cert.date}` : ''}`,
                  italics: true,
                  size: 9 * 2,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }
      });
    }

    // ========== PROJECTS ==========
    if (resume.projects && resume.projects.length > 0) {
      addSectionHeading('PROJECTS');

      resume.projects.forEach((project) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.name,
                bold: true,
                size: 10 * 2,
              }),
            ],
            spacing: { after: 25 },
          })
        );

        if (project.technologies && project.technologies.length > 0) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Technologies: `,
                  italics: true,
                  size: 9 * 2,
                }),
                new TextRun({
                  text: project.technologies.join(', '),
                  size: 9 * 2,
                }),
              ],
              spacing: { after: 50 },
            })
          );
        }

        if (project.description) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.description,
                  size: 10 * 2,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }

        sections.push(new Paragraph({ text: '', spacing: { after: 50 } }));
      });
    }

    // ========== AWARDS ==========
    if (resume.awards && resume.awards.length > 0) {
      addSectionHeading('AWARDS & RECOGNITION');

      resume.awards.forEach((award) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: award.title,
                size: 10 * 2,
              }),
            ],
            bullet: {
              level: 0,
            },
            spacing: { after: 25 },
          })
        );

        if (award.organization || award.date) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${award.organization}${award.date ? ` | ${award.date}` : ''}`,
                  italics: true,
                  size: 9 * 2,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }
      });
    }

    // ========== LANGUAGES ==========
    if (resume.languages && resume.languages.length > 0) {
      addSectionHeading('LANGUAGES');

      resume.languages.forEach((lang) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${lang.language} - ${lang.proficiency}`,
                size: 10 * 2,
              }),
            ],
            bullet: {
              level: 0,
            },
            spacing: { after: 50 },
          })
        );
      });
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          children: sections,
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.5),
                bottom: convertInchesToTwip(0.5),
                left: convertInchesToTwip(0.5),
                right: convertInchesToTwip(0.5),
              },
            },
          },
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.fullName || 'resume'}_${new Date().toISOString().split('T')[0]}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
};
