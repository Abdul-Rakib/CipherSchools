import React from 'react'
import { Link } from 'react-router-dom'
import GoogleAuthButton from './GoogleAuthButton'
import EmailLogin from './EmailLogin'

export default function Login() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo placeholder - replace with your actual logo */}
        <div className="mx-auto h-12 w-12 bg-[#229799] rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Google Auth Button */}
            <div>
              <div className="mt-1 flex justify-center">
                <GoogleAuthButton />
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Other options
                </span>
              </div>
            </div>

            {/* You can add other login methods here */}
            <div className="flex items-center justify-center">
              <div className="text-sm">
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Don't have an account? Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
        <EmailLogin />
      </div>



      {/* Footer */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center space-x-4">
          <a href="/terms-and-condition" className="text-sm text-gray-500 hover:text-gray-900">
            Terms of Service
          </a>
          <span className="text-gray-500">•</span>
          <a href="/privacypage" className="text-sm text-gray-500 hover:text-gray-900">
            Privacy Policy
          </a>
          <span className="text-gray-500">•</span>
          <a href="/contact" className="text-sm text-gray-500 hover:text-gray-900">
            Help
          </a>
        </div>
      </div>
    </div>
  )
}