import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userPublicId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    mobileNumber: {
        type: String,
        unique: true,
        maxlength: 10,
        minlength: 10,
        required: true,
    },
    userType: {
        type: String,
        enum: ['admin', 'vendor', 'user'],
        default: 'user',
    },
    authType: {
        type: String,
        enum: ['google', 'mobile', 'email'],
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    imageUrl: {
        type: String,
        default: "",
    },
    lastSession: {
        type: Date,
        default: Date.now,
    },
    deviceInfo: {
        type: Object,
        default: {},
    },
    remarks: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;