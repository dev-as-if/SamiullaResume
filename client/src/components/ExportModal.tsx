import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText, FiFile } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { ResumeData } from '../store/resumeStore';
import { generatePDF, generateDOCX } from '../utils/exportUtils';

interface ExportModalProps {
  resume: ResumeData;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  resume,
  isOpen,
  onClose,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [photoPosition, setPhotoPosition] = useState<'left' | 'right' | 'none'>('right');
  const hasPhoto = !!resume.profilePhoto;

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      toast.loading('Generating PDF...');
      await generatePDF(resume, photoPosition);
      toast.dismiss();
      toast.success('PDF downloaded successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDOCX = async () => {
    try {
      setIsExporting(true);
      toast.loading('Generating Word document...');
      await generateDOCX(resume);
      toast.dismiss();
      toast.success('Word document downloaded successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to generate document');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Export Resume
        </h2>
        <p className="text-gray-600 mb-4">
          Choose your preferred format to download your resume.
        </p>

        {/* Photo Position Selection */}
        {hasPhoto && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              📷 Photo Position (PDF only)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="photoPos"
                  value="right"
                  checked={photoPosition === 'right'}
                  onChange={(e) => setPhotoPosition(e.target.value as 'left' | 'right' | 'none')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Right side (Default)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="photoPos"
                  value="left"
                  checked={photoPosition === 'left'}
                  onChange={(e) => setPhotoPosition(e.target.value as 'left' | 'right' | 'none')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Left side</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="photoPos"
                  value="none"
                  checked={photoPosition === 'none'}
                  onChange={(e) => setPhotoPosition(e.target.value as 'left' | 'right' | 'none')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">No photo</span>
              </label>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <motion.button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-4 border-2 border-red-200 hover:border-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <FiFileText className="text-2xl text-red-500" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">PDF</p>
                <p className="text-sm text-gray-600">Pixel-perfect format</p>
              </div>
            </div>
            <FiDownload className="text-gray-400" />
          </motion.button>

          <motion.button
            onClick={handleExportDOCX}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-4 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <FiFile className="text-2xl text-blue-500" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Word</p>
                <p className="text-sm text-gray-600">Editable format</p>
              </div>
            </div>
            <FiDownload className="text-gray-400" />
          </motion.button>
        </div>

        <motion.button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ExportModal;
