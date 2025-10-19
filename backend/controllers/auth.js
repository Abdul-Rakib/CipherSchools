import { auth, OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import Otp from '../models/otp.js';
import { sendOneApiOtp, generateOtp } from '../utils/smsUtils.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateJwtToken = (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '6h' });
    return token;
}

const generateUserId = () => {
    const date = new Date();
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const datePart = yy + mm; // e.g., '2508'

    // Generate 5 random uppercase alphanumeric chars (letters + digits)
    // Using base36 (0-9 + a-z), then convert letters to uppercase
    const randomPart = Math.random()
        .toString(36)
        .substr(2, 5)
        .toUpperCase();

    return datePart + randomPart;
};


const verifyGoogleCredential = async (credential) => {
    try {

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        return {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name,
            imageUrl: payload.picture
        }

    } catch (err) {
        console.error(err?.response?.data?.msg || err.msg || err);
    }
}

const createNewUser = async (userData) => {
    const user = new User({
        ...userData,
        userPublicId: generateUserId(),
    });
    await user.save();
    return user;
}

export const verifyOtp = async (phoneNumber, otp) => {
    try {
        const otpDoc = await Otp.findOne({ mobileNumber: phoneNumber });
        if (!otpDoc) {
            return { success: false, msg: 'Invalid OTP' };
        }
        if (new Date() > new Date(otpDoc.otpExpiry)) {
            await Otp.deleteOne({ mobileNumber: phoneNumber });
            return { success: false, msg: 'OTP expired. Please request a new one.' };
        }
        if (String(otpDoc.mobileOtp) !== String(otp)) {
            return { success: false, msg: 'Invalid or expired OTP' };
        }
        await Otp.deleteOne({ mobileNumber: phoneNumber });

        return { success: true, msg: 'OTP verified successfully' };
    } catch (err) {
        console.error("Error verifying OTP:", err);
        return { success: false, msg: 'Error verifying OTP' };
    }
}

export const googleAuth = async (req, res) => {

    try {
        const { credential } = req.body;
        const payload = await verifyGoogleCredential(credential);
        if (!payload) {
            return res.status(400).json({ success: false, msg: 'Invalid Google credential' });
        }
        const { googleId, email, name, imageUrl } = payload;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const token = generateJwtToken(existingUser);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // only send over HTTPS in production
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                maxAge: 6 * 60 * 60 * 1000, // 6 hours
            });
            return res.status(200).json({ success: true, msg: "User authenticated successfully", data: { token } });
        }

        res.status(201).json({
            success: false,
            msg: "New user detected.",
            data: { googleEmail: email }
        });

    } catch (err) {
        console.error("Error in Google authentication:", err);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

export const registerNewUser = async (req, res) => {
    try {
        const { email, credential, phoneNumber, otp } = req.body;

        if (!email || !credential || !phoneNumber || !otp) {
            return res.status(400).json({ success: false, msg: 'All fields are required' });
        }
        const payload = await verifyGoogleCredential(credential);
        if (!payload) {
            return res.status(400).json({ success: false, msg: 'Invalid Google credential' });
        }
        const { googleId, name, email: googleEmail, imageUrl } = payload;

        // Normalize phone number - remove non-digits
        let normalizedPhone = phoneNumber.replace(/\D/g, '');
        // Remove leading 0 if length > 10
        if (normalizedPhone.length > 10 && normalizedPhone.startsWith('0')) {
            normalizedPhone = normalizedPhone.substring(1);
        }
        // Validate phone number length
        if (normalizedPhone.length !== 10) {
            return res.status(400).json({ success: false, msg: 'Mobile number must be of 10 digits' });
        }

        const existingUser = await User.findOne({ mobileNumber: phoneNumber });

        if (existingUser) {
            return res.status(400).json({ success: false, msg: "User already exists. Please try logging in." });
        }
        const verificationResult = await verifyOtp(phoneNumber, otp);

        if (!verificationResult.success) {
            return res.status(400).json({ success: false, msg: verificationResult.msg });
        }

        const newUser = await createNewUser({
            name,
            email: googleEmail.trim().toLowerCase(),
            mobileNumber: phoneNumber,
            authType: 'google',
            isProfileComplete: true,
            imageUrl,
            lastSession: new Date(),
        });
        const token = generateJwtToken(newUser);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // only send over HTTPS in production
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 6 * 60 * 60 * 1000, // 6 hours
        });
        res.status(200).json({ success: true, msg: "User authenticated successfully", data: { token } });

    } catch (err) {
        console.error("Error in mobile authentication:", err);
        res.status(500).json({ success: false, msg: "Internal server error" });

    }
}

export const sendOtp = async (req, res) => {
    try {
        const { phoneNumber, purpose } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ success: false, msg: 'Phone number is required' });
        }
        if (purpose == 'register') {
            const existingUser = await User.findOne({ mobileNumber: phoneNumber });
            if (existingUser) {
                return res.status(400).json({ success: false, msg: "User already exists. Please try logging in." });
            }
        }

        const cooldownPeriod = 2 * 60 * 1000; // 2 minutes
        const otpExpiryPeriod = 5 * 60 * 1000; // 5 minutes
        const oneHour = 1 * 60 * 60 * 1000;

        let otpDoc = await Otp.findOne({ mobileNumber: phoneNumber });

        // Reset attempts if last sent > 1 hr ago
        if (otpDoc && otpDoc.otpLastSent) {
            const timeSinceLastSent = Date.now() - new Date(otpDoc.otpLastSent).getTime();
            if (timeSinceLastSent > oneHour) {
                otpDoc.otpAttempts = 0;
                await otpDoc.save();
            }

            // Abuse protection – too many attempts
            if (otpDoc.otpAttempts > 5) {
                return res.status(429).json({
                    success: false,
                    msg: "Too many OTP requests. Please try again after 1 hour."
                });
            }

            // Cooldown protection – 5 min wait
            const cooldownLeft = cooldownPeriod - timeSinceLastSent;
            if (cooldownLeft > 0) {
                const secondsLeft = Math.ceil(cooldownLeft / 1000);
                return res.status(429).json({
                    success: false,
                    msg: `OTP already sent. Please wait ${secondsLeft} seconds before requesting a new one.`,
                    retryAfter: secondsLeft
                });
            }
        }

        const otp = generateOtp(); // 6-digit OTP generator

        const smsResponse = await sendOneApiOtp(phoneNumber, otp);
        if (smsResponse.success) {

            if (!otpDoc) {
                otpDoc = new Otp({
                    mobileNumber: phoneNumber,
                    mobileOtp: otp,
                    otpExpiry: new Date(Date.now() + otpExpiryPeriod),
                    otpLastSent: new Date(),
                    otpAttempts: 1
                });
            } else {
                otpDoc.mobileOtp = otp;
                otpDoc.otpExpiry = new Date(Date.now() + otpExpiryPeriod);
                otpDoc.otpLastSent = new Date();
                otpDoc.otpAttempts += 1;
            }

            await otpDoc.save();

            return res.status(200).json({
                success: true,
                msg: "OTP sent successfully"
            });
        }
        return res.status(500).json({
            success: false,
            msg: smsResponse.msg || "Failed to send OTP"
        });

    } catch (err) {
        console.error("Error sending OTP:", err);
        return res.status(500).json({ success: false, msg: "Failed to send OTP" });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });
    res.status(200).json({ success: true, msg: "Logged out successfully" });
};

export const testLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate test credentials
        if (email !== 'test@gmail.com' || password !== '123456') {
            return res.status(401).json({
                success: false,
                msg: 'Invalid test credentials. Use test@gmail.com / 123456'
            });
        }

        // Find the main test account (firefalls2004@gmail.com)
        const testUser = await User.findOne({ email: 'firefalls2004@gmail.com' });

        if (!testUser) {
            return res.status(404).json({
                success: false,
                msg: 'Test account not found. Please contact administrator.'
            });
        }

        // Generate JWT token for the test user
        const token = generateJwtToken(testUser);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 6 * 60 * 60 * 1000, // 6 hours
        });

        // Update last session without triggering validation
        await User.updateOne(
            { _id: testUser._id },
            { $set: { lastSession: new Date() } }
        );

        return res.status(200).json({
            success: true,
            msg: "Test login successful",
            data: { token }
        });

    } catch (err) {
        console.error("Error in test login:", err);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
