import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'
import { toast } from 'react-toastify'
import GoogleAuthButton from './GoogleAuthButton'

export default function Register() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    loading,
    errorMsg,
    phoneNumber,
    setPhoneNumber,
    sendOtp,
    resendOtp,
    isOtpSent,
    handleGoogleAuth
  } = useAuth()

  const [otp, setOtp] = useState('')
  const [registering, setRegistering] = useState(false)
  const [googleEmail, setGoogleEmail] = useState('')
  const [googleCredential, setGoogleCredential] = useState('')
  const [needsGoogleAuth, setNeedsGoogleAuth] = useState(true)

  useEffect(() => {
    // Get data from navigation state
    if (location.state && location.state.googleEmail && location.state.googleCredential) {
      setGoogleEmail(location.state.googleEmail)
      setGoogleCredential(location.state.googleCredential)
      setNeedsGoogleAuth(false)
    }
  }, [location])

  const handleSubmitOtp = async (e) => {
    e.preventDefault()

    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP')
      return
    }

    if (!phoneNumber || !googleEmail || !googleCredential) {
      toast.error('Missing required information')
      return
    }

    setRegistering(true)

    try {
      const response = await axios.post('/api/auth/register', {
        email: googleEmail,
        credential: googleCredential,
        phoneNumber,
        otp
      })

      if (response.data.success) {
        toast.success('Registration successful!')
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('token', response.data.data.token)

        // Decode JWT to get user ID
        try {
          const base64Url = response.data.data.token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          localStorage.setItem('userId', decoded._id);
        } catch (e) {
          console.error('Failed to decode token:', e);
        }

        navigate('/')
      } else {
        toast.error(response.data.msg || 'Registration failed')
      }
    } catch (error) {
      const msg = error.response?.data?.msg || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setRegistering(false)
    }
  }

  // Handle Google auth response directly on this page
  const onGoogleSuccess = async (credential) => {
    try {
      const response = await axios.post('/api/auth/google', {
        credential
      })

      const data = response.data

      if (data.success && data.data) {
        // Existing user - redirect to home
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('token', data.data.token)

        // Decode JWT to get user ID
        try {
          const base64Url = data.data.token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          localStorage.setItem('userId', decoded._id);
        } catch (e) {
          console.error('Failed to decode token:', e);
        }

        navigate('/')
      } else if (data.success === false && data.msg === "New user detected.") {
        // New user - continue with registration
        // Directly update the state instead of relying on navigation state
        setGoogleEmail(data.data.googleEmail)
        setGoogleCredential(credential)
        setNeedsGoogleAuth(false)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google authentication failed')
    }
  }

  // Streamlined, low-friction registration flow
  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h2>
        <p className="text-gray-600 mb-4">Sign up instantly with Google and your phone</p>
        {/* Google Auth Step or summary */}
        {needsGoogleAuth ? (
          <div className="mb-8 text-center">
            <GoogleAuthButton onSuccess={onGoogleSuccess} />
            <p className="text-xs text-gray-500 mt-4">
              By continuing, you agree to our Terms and Privacy Policy
            </p>
          </div>
        ) : (
          <div className="mb-4 flex items-center bg-gray-50 rounded-md px-3 py-2">
            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="ml-2 text-sm text-gray-700 truncate">{googleEmail}</span>
            <button
              onClick={() => {
                setGoogleEmail("");
                setGoogleCredential("");
                setNeedsGoogleAuth(true);
              }}
              className="ml-auto text-xs text-[#229799] hover:underline"
            >
              Change
            </button>
          </div>
        )}
        {/* Phone/OTP Step */}
        {!needsGoogleAuth && (
          <>
            {!isOtpSent ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                sendOtp(phoneNumber, "register");
              }}>
                <div className="mb-4">
                  <label htmlFor="phone" className="sr-only">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#229799] text-white py-3 rounded-md font-medium hover:bg-[#229799] transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitOtp}>
                <div className="mb-4">
                  <label htmlFor="otp" className="sr-only">Verification Code</label>
                  <input
                    id="otp"
                    type="text"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center tracking-widest text-lg"
                    placeholder="Enter verification code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#229799] text-white py-3 rounded-md font-medium hover:bg-[#229799] transition-colors"
                  disabled={registering}
                >
                  {registering ? 'Completing Signup...' : 'Complete Signup'}
                </button>
                <button
                  type="button"
                  className="w-full text-[#229799] mt-2 py-2 text-sm"
                  onClick={resendOtp}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend code'}
                </button>
              </form>
            )}
          </>
        )}
        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 text-sm text-red-600">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}