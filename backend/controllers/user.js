import User from "../models/user.js";
import { verifyOtp } from "./auth.js";

export const getUserProfile = async (req, res) => {
    try {
        const _id = req.user._id;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        const { userId, name, email, mobileNumber, imageUrl } = user;
        res.status(200).json({
            success: true,
            msg: "User profile retrieved successfully",
            data: {
                userId,
                name,
                email,
                mobileNumber,
                imageUrl,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const _id = req.user._id;
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const { name, mobileNumber, otp } = req.body;

        if (!name || !mobileNumber || !otp) {
            return res.status(400).json({ success: false, msg: "Name, Mobile Number, or OTP is missing." });
        }

        const existingUser = await User.findOne({ mobileNumber })
        if (existingUser) {
            res.status(400).json({ success: false, msg: "Mobile Number is already registered." })
        }

        const verificationResult = await verifyOtp(mobileNumber, otp);

        if (!verificationResult.success) {
            return res.status(400).json({ success: false, msg: verificationResult.msg });
        }

        user.name = name;
        user.mobileNumber = mobileNumber;

        await user.save();

        return res.status(200).json({ success: true, msg: "Profile Updated Successfully." });

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
}
