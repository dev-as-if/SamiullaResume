import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface PhotoUploadProps {
  photo?: string;
  onPhotoSelect: (photoBase64: string) => void;
  onPhotoRemove: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photo,
  onPhotoSelect,
  onPhotoRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB for reasonable resume size)
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setIsLoading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      onPhotoSelect(base64String);
      toast.success('Photo added successfully');
      setIsLoading(false);
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>

      {photo ? (
        // Photo Display
        <div className="space-y-3">
          <div className="relative inline-block">
            <img
              src={photo}
              alt="Profile"
              className="w-32 h-40 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              onClick={onPhotoRemove}
              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              title="Remove photo"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-900">✓ Photo added to resume</p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Change photo
          </button>
        </div>
      ) : (
        // Upload Area
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="space-y-2">
            {isLoading ? (
              <>
                <div className="inline-block">
                  <div className="animate-spin">
                    <FiUploadCloud size={32} className="text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <FiUploadCloud size={32} className="mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Drop your photo here</p>
                  <p className="text-xs text-gray-500">or click to select</p>
                </div>
                <p className="text-xs text-gray-400">JPG, PNG up to 2MB</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
        <p className="text-xs font-medium text-blue-900">📸 Photo Tips:</p>
        <ul className="text-xs text-blue-900 space-y-1 ml-4 list-disc">
          <li>Professional headshot recommended</li>
          <li>Minimum 200x300 pixels (for printing quality)</li>
          <li>Clear face, good lighting</li>
          <li>Will appear on the right side of header</li>
        </ul>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default PhotoUpload;
