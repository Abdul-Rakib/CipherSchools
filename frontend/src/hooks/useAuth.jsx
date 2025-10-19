import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/globalContext'
import axios from 'axios'
import { toast } from 'react-toastify'

export const useAuth = () => {

    const navigate = useNavigate()
    const { phoneNumber, setPhoneNumber, isLoggedIn, setIsLoggedIn } = useContext(GlobalContext)
    // State management
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isOtpSent, setIsOtpSent] = useState(false)

    // Google Authentication
    const handleGoogleAuth = async (credential) => {
        if (!credential) {
            setErrorMsg('Google authentication failed')
            return false
        }
        setLoading(true)
        try {
            const response = await axios.post('/api/auth/google', {
                credential
            })
            const data = response.data

            if (data.success && data.data) {
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

                setIsLoggedIn(true);
                navigate('/dashboard')
                return true
            } else if (data.success === false && data.msg === "New user detected.") {
                // This is a new user case
                navigate('/register', {
                    state: {
                        googleEmail: data.data.googleEmail,
                        googleCredential: credential
                    }
                })
                return true
            }

        } catch (error) {
            const msg = error.response?.data?.message || 'Google authentication failed'
            setErrorMsg(msg)
            return false
        } finally {
            setLoading(false)
        }
    }

    // Send OTP
    const sendOtp = async (phone, purpose) => {
        if (!phone || phone.length < 10) {
            setErrorMsg('Please enter a valid phone number')
            return false
        }
        setLoading(true)
        setPhoneNumber(phone)

        try {
            const response = await axios.post('/api/auth/send-otp', {
                phoneNumber: phone,
                purpose
            })

            if (response.data.success) {
                setIsOtpSent(true)
                toast.success('OTP sent successfully!')
            } else {
                toast.error(response.data.msg || 'Failed to send OTP. Please try again.')
                setErrorMsg(response.data.msg || 'Failed to send OTP. Please try again.')
            }
        } catch (error) {
            console.log('Error sending OTP:', error);

            const msg = error.response.data?.msg || 'Network error. Please try again.'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    // Resend OTP
    const resendOtp = async () => {
        if (!phoneNumber) {
            setErrorMsg('Phone number not found')
            return false
        }
        return await sendOtp(phoneNumber)
    }

    // Logout
    const logout = () => {
        setLoading(true)
        axios.post('/api/auth/logout')
            .then(response => {
                if (response.data.success) {
                    setSuccessMsg('Logged out successfully!')
                    navigate('/login')
                }
            })
            .catch(error => {
                const msg = error.response?.data?.msg || 'Logout failed'
                setErrorMsg(msg)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return {
        // State
        loading,
        successMsg,
        errorMsg,
        phoneNumber,
        isOtpSent,

        // Actions
        handleGoogleAuth,
        setPhoneNumber,
        sendOtp,
        resendOtp,
        logout,
    }
}