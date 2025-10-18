import mongoose from "mongoose";
import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, msg: "Users retrieved successfully", data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, msg: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        res.status(200).json({ success: true, msg: "User retrieved successfully", data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}

export const updateUserDetails = async (req, res) => {
    try {
        const { userId } = req.body;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, msg: "Invalid user ID format" });
        }

        // Define allowed fields to update
        const allowedFields = [
            "name",
            "email",
            "mobileNumber",
            "imageUrl",
            "isProfileComplete",
            "deviceInfo",
            "remarks"
        ];

        const safeUpdates = {};
        for (let key of allowedFields) {
            if (updates[key] !== undefined) safeUpdates[key] = updates[key];
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: safeUpdates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        res.status(200).json({
            success: true,
            msg: "User details updated successfully",
            data: updatedUser
        });

    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({
                success: false,
                msg: `The ${field} is already in use`
            });
        }
        console.error(err);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};