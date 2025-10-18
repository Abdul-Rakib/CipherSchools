import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileForm({ profile, onProfileUpdate }) {
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
      // Handle OTP sent success
      alert('OTP sent successfully!');
    }
  };
  return (
    <div className="p-4 sm:p-6 space-y-6 w-full max-w-full box-border overflow-x-hidden">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Profile Details</h3>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#229799] text-white rounded-lg hover:bg-[#229799] transition-all duration-300 shadow-sm"
          >
            <FaEdit className="text-sm" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
        <div className="text-gray-600 break-all">{profile.email}</div>
      </div>

      {/* Edit Mode Fields */}
      {editMode ? (
        <form className="space-y-4 w-full max-w-full overflow-x-hidden">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full max-w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 box-border"
              placeholder="Enter your full name"
            />
          </div>

          {/* Mobile Number Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
            <div className="flex space-x-2 w-full max-w-full">
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 box-border"
                placeholder="+91 1234567890"
              />
              {formData.mobileNumber !== originalMobileNumber && formData.mobileNumber && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={authLoading || !formData.mobileNumber}
                  className="px-3 py-2 bg-[#229799] text-white rounded-lg hover:bg-[#229799] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs whitespace-nowrap flex-shrink-0"
                >
                  {authLoading ? 'Sending...' : 'Send OTP'}
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Display Mode Fields */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="text-gray-900 font-medium">{profile.name || 'Not provided'}</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
            <div className="text-gray-900 font-medium">{profile.mobileNumber || 'Not provided'}</div>
          </div>
        </>
      )}
    </div>
  );
}