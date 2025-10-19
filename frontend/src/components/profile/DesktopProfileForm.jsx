import React, { useState } from 'react';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import AccountStats from './AccountStats';

export default function DesktopProfileForm({ profile, onProfileUpdate }) {
  const { sendOtp, loading: authLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    mobileNumber: profile?.mobileNumber || ''
  });
  const [originalMobileNumber, setOriginalMobileNumber] = useState(profile?.mobileNumber || '');

  const validateMobileNumber = (phoneNumber) => {
    return phoneNumber && phoneNumber.length >= 10;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onProfileUpdate) {
      onProfileUpdate(formData);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      mobileNumber: profile?.mobileNumber || ''
    });
    setOriginalMobileNumber(profile?.mobileNumber || '');
    setEditMode(false);
  };

  const handleSendOtp = async () => {
    if (!validateMobileNumber(formData.mobileNumber)) {
      alert('Please enter a valid mobile number');
      return;
    }

    const success = await sendOtp(formData.mobileNumber, 'profile_update');
    if (success !== false) {
      alert('OTP sent successfully!');
    }
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg w-full max-w-full box-border overflow-x-hidden">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
        {!editMode ? (
          <button
            onClick={() => onEditToggle(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-[#229799] text-white rounded-xl hover:bg-[#229799] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaEdit className="text-sm" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              <FaTimes className="text-sm" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg"
            >
              <FaCheck className="text-sm" />
              <span>Save</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-full overflow-x-hidden">
        {/* Email Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={profile.email || ''}
              className="w-full max-w-full min-w-0 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed box-border"
              disabled
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Email address cannot be changed for security reasons</p>
        </div>

        {/* Name Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full max-w-full min-w-0 px-6 py-4 rounded-xl transition-all duration-300 box-border ${editMode
              ? 'bg-white border-2 border-blue-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
              : 'bg-gray-50 border border-gray-200 text-gray-600 cursor-not-allowed'
              }`}
            disabled={!editMode}
            placeholder="Enter your full name"
          />
        </div>

        {/* Mobile Number Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Mobile Number
          </label>
          <div className="flex space-x-3 w-full max-w-full">
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className={`flex-1 min-w-0 px-6 py-4 rounded-xl transition-all duration-300 box-border ${editMode
                ? 'bg-white border-2 border-blue-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                : 'bg-gray-50 border border-gray-200 text-gray-600 cursor-not-allowed'
                }`}
              disabled={!editMode}
              placeholder="+91 1234567890"
            />
            {editMode && formData.mobileNumber !== originalMobileNumber && formData.mobileNumber && (
              <button
                onClick={handleSendOtp}
                disabled={authLoading || !formData.mobileNumber}
                className="px-4 py-4 bg-[#229799] text-white rounded-xl hover:bg-[#229799] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex-shrink-0"
              >
                {authLoading ? 'Sending...' : 'Send OTP'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}