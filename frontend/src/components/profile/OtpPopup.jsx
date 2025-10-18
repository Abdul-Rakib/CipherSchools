import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

export default function OtpPopup({ show, mobileNumber, onVerifySuccess, onClose }) {
  const { resendOtp, loading: authLoading } = useAuth();
  const [otpData, setOtpData] = useState({
    otp: '',
    purpose: 'profile_update'
  });

  const validateOtp = (otp) => {
    return otp && otp.length === 6;
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerify = async () => {
    if (!validateOtp(otpData.otp)) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      // Here you would call your API to verify OTP
      // For now, simulate successful verification
      if (onVerifySuccess) {
        onVerifySuccess();
      }
      handleClose();
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to verify OTP');
    }
  };

  const handleResend = async () => {
    await resendOtp();
  };

  const handleClose = () => {
    setOtpData({
      otp: '',
      purpose: 'profile_update'
    });
    if (onClose) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Verify Mobile Number</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter OTP
            </label>
            <p className="text-sm text-gray-600 mb-3">
              OTP sent to <span className="font-medium text-gray-900">{mobileNumber}</span>
            </p>
            <input
              type="text"
              name="otp"
              value={otpData.otp}
              onChange={handleOtpChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength="6"
              autoFocus
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={!otpData.otp || otpData.otp.length !== 6}
              className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Verify & Update
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleResend}
              disabled={authLoading}
              className="text-sm text-[#229799] hover:text-[#229799] transition-colors disabled:text-gray-400"
            >
              {authLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}