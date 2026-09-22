import { Schema, model } from "mongoose";

const userSchema = new Schema({

    fullName: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true,
        lowercase: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        minlength: [2, "Email must be at least 2 characters"],
        unique: true,
    },
    dp: {
        type: String,
        trim: true,
        lowercase: true,
        default: null
    },
    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        unique: true,
        trim: true,
        match: [/^[0-9]{10}$/, "Invalid mobile number"],
        unique: true,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    role: {
        type: String,
        enum: ["admin", "user", "superAdmin"],
        default: "user",
    },
    verified: {
        type: Boolean,
        default: false,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
    credits: {
        type: Number,
        default: 0,
        min: [0, "Credits cannot be negative"],
    },
    reason: {
        type: String,
        trim: true,
        maxlength: [1000, "Reason cannot exceed 1000 characters"],
        default: null,
    },
    totalFolders: {
        type: Number,
        default: 1,
        min: [0, "Total folders cannot be negative"],
    },
    usedFolders: {
        type: Number,
        default: 0,
        min: [0, "Used folders cannot be negative"],
    },
    totalShareLimit: {
        type: Number,
        default: 3,
        min: [0, "Total share limit cannot be negative"],
    },
    usedShareLimit: {
        type: Number,
        default: 0,
        min: [0, "Used share limit cannot be negative"],
    },
    storageLimit: {
        type: Number,
        default: 50 * 1024 * 1024, // 50 MB
        min: [0, "Storage limit cannot be negative"],
    },
    usedStorage: {
        type: Number,
        default: 0,
        min: [0, "Used storage cannot be negative"],
    },
    creditsTransferred: {
        type: Number,
        default: 0,
        min: [0, "Credits transferred cannot be negative"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        maxlength: [100, "Password cannot exceed 100 characters"],
        select: false,
    },
    otp: {
        type: String,
        default: null,
        select: false,
    },
    otpExpiresAt: {
        type: Date,
        default: null,
        select: false,
    },

}, { timestamps: true });

export default model("user", userSchema);