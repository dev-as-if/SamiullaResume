import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface MultiEntryField {
  id: string;
  [key: string]: any;
}

interface MultiEntryFormProps<T extends MultiEntryField = MultiEntryField> {
  title: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'date';
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
  }>;
  entries: T[];
  onAdd: (entry: Record<string, any>) => void;
  onUpdate: (id: string, entry: Record<string, any>) => void;
  onRemove: (id: string) => void;
  displayFormat?: (entry: T) => string; // How to display entry in list
  allowOptional?: boolean;
  maxEntries?: number;
}

export const MultiEntryForm = <T extends MultiEntryField>({
  title,
  fields,
  entries,
  onAdd,
  onUpdate,
  onRemove,
  displayFormat,
  allowOptional = true,
  maxEntries = undefined,
}: MultiEntryFormProps<T>) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    // Validate required fields
    const missingFields = fields
      .filter((f) => f.required)
      .filter((f) => !formData[f.name] || formData[f.name].trim() === '');

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.map((f) => f.label).join(', ')}`);
      return;
    }

    if (editingId) {
      onUpdate(editingId, formData);
      toast.success(`${title} updated successfully`);
    } else {
      if (maxEntries && entries.length >= maxEntries) {
        toast.error(`You can add maximum ${maxEntries} ${title.toLowerCase()}`);
        return;
      }
      onAdd(formData);
      toast.success(`${title} added successfully`);
    }

    resetForm();
  };

  const handleEdit = (entry: T) => {
    setEditingId(entry.id);
    const editData: any = { ...entry };
    delete editData.id;
    setFormData(editData);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      onRemove(id);
      toast.success(`${title} deleted successfully`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {entries.length > 0 && (
          <span className="text-sm text-gray-500">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
        )}
      </div>

      {/* Entries List */}
      <AnimatePresence mode="popLayout">
        {entries.length > 0 && (
          <motion.div layout className="space-y-2">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group"
                >
                  <span className="text-left text-sm font-medium text-gray-900">
                    {displayFormat ? displayFormat(entry) : JSON.stringify(entry)}
                  </span>
                  <FiChevronDown
                    size={18}
                    className={`text-gray-600 transition-transform ${
                      expandedId === entry.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expanded View */}
                <AnimatePresence>
                  {expandedId === entry.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 px-4 py-3 bg-white space-y-3"
                    >
                      {/* Entry Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {fields.map((field) => (
                          <div key={field.name}>
                            <p className="text-xs font-medium text-gray-600">{field.label}</p>
                            <p className="text-gray-900 break-words">
                              {entry[field.name] || '—'}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors text-sm font-medium"
                        >
                          <FiEdit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors text-sm font-medium"
                        >
                          <FiTrash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Button */}
      {(!maxEntries || entries.length < maxEntries) && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-blue-300 hover:border-blue-500 text-blue-600 hover:text-blue-700 rounded-lg transition-colors font-medium"
        >
          <FiPlus size={20} />
          Add {title}
        </button>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-blue-200 rounded-lg p-4 space-y-4 bg-blue-50"
          >
            <h4 className="font-medium text-gray-900">
              {editingId ? 'Edit' : 'Add New'} {title}
            </h4>

            {/* Form Fields */}
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {entries.length === 0 && !showForm && (
        <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-500">
          <p className="text-sm">
            {allowOptional ? 'Optional' : 'Required'} - Add at least one {title.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiEntryForm;
