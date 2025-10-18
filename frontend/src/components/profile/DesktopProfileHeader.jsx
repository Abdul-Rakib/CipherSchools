import React from 'react';
import { FaUser } from 'react-icons/fa';

export default function DesktopProfileHeader({ profile }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg w-full max-w-full box-border">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-8 w-full max-w-full box-border overflow-x-hidden">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <FaUser className="text-3xl text-gray-700" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {profile.name || 'User'}
          </h2>
          <p className="text-gray-600 text-center break-all px-4">{profile.email}</p>
          
          {/* Status Badge */}
          <div className="mt-4 px-3 py-2 bg-green-100 border border-green-200 rounded-full">
            <span className="text-green-700 text-sm font-medium flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Active Account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}