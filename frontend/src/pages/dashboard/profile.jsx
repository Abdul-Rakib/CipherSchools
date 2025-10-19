import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileForm from '../../components/profile/ProfileForm';
import AccountStats from '../../components/profile/AccountStats';
import OtpPopup from '../../components/profile/OtpPopup';
import DesktopProfileHeader from '../../components/profile/DesktopProfileHeader';
import DesktopProfileForm from '../../components/profile/DesktopProfileForm';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpMobileNumber, setOtpMobileNumber] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/user/user-profile');
      if (response.data.success) {
        setProfile(response.data.data);
      } else {
        setError(response.data.msg || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err?.response?.data?.msg || 'An error occurred while fetching your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (newProfileData) => {
    setProfile(prev => ({
      ...prev,
      ...newProfileData
    }));
  };

  const handleShowOtpPopup = (mobileNumber) => {
    setOtpMobileNumber(mobileNumber);
    setShowOtpPopup(true);
  };

  const handleOtpVerifySuccess = () => {
    // Handle successful OTP verification
    setShowOtpPopup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-200">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-700 mt-6 text-center text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center max-w-md w-full">
          <div className="text-red-500 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-8 py-3 bg-[#229799] text-white rounded-xl hover:bg-[#229799] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'hidden', width: '100vw', maxWidth: '100%' }}>
      <div className="min-h-screen bg-transparent pb-16 md:pb-4" style={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw', height: 'auto' }}>
        <div className="max-w-6xl mx-auto p-3 md:py-4" style={{ overflowX: 'hidden', width: '100%', maxWidth: '100%' }}>

          {/* Mobile View - Single Card */}
          <div className="md:hidden w-full max-w-full overflow-x-hidden">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg w-full max-w-full box-border">
              <ProfileHeader profile={profile} />
              <ProfileForm
                profile={profile}
                onProfileUpdate={handleProfileUpdate}
              />
            </div>
          </div>

          {/* Desktop View - Two Column Layout */}
          <div className="hidden md:flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl w-full">

              {/* Profile Card - Desktop: Left column */}
              <div className="lg:col-span-1">
                <DesktopProfileHeader profile={profile} />
              </div>

              {/* Profile Information - Desktop: Right columns */}
              <div className="lg:col-span-2">
                <DesktopProfileForm
                  profile={profile}
                  onProfileUpdate={handleProfileUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <OtpPopup
        show={showOtpPopup}
        mobileNumber={otpMobileNumber}
        onVerifySuccess={handleOtpVerifySuccess}
        onClose={() => setShowOtpPopup(false)}
      />
    </div>
  );
}