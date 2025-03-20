import React, { useState } from 'react';
import { X } from 'lucide-react';

const AIAssistantSetup = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('general');

  const specialties = [
    { id: 'general', name: 'General Assistant' },
    { id: 'technical', name: 'Technical Support' },
    { id: 'creative', name: 'Creative Writing' },
    { id: 'research', name: 'Research Assistant' },
    { id: 'coding', name: 'Coding Assistant' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), specialty });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Create AI Assistant
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Assistant Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter assistant name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Specialty Selection */}
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
              Specialty
            </label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Assistant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantSetup; 