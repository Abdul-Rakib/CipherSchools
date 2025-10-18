import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        unique: true,
        maxlength: 10,
        minlength: 10,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    mobileOtp: {
        type: String,
        default: "",
    },
    emailOtp: {
        type: String,
        default: "",
    },
    otpExpiry: {
        type: Date,
        default: null,
    },
    otpLastSent: {
        type: Date,
        default: null,
    },
    otpAttempts: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;