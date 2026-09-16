import userModel from "../models/user.model.js";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { verifyAccountEmail } from "../templates/verifyAccount.js";


const signup = async (req, res) => {

    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Bad Request"
            });
        };

        const { email, mobileNumber, password } = req.body;

        const existingUser = await userModel.findOne({ $or: [{ email }, { mobileNumber }] });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email or mobile number already registered"
            });
        };

        const hashPass = await bycrpt.hash(password, 10);

        const payLoad = {
            ...req.body,
            password: hashPass
        };

        await userModel.create(payLoad);

        return res.status(201).json({
            success: true,
            message: "Registration Complete",
        });

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }
};

const login = async (req, res) => {

    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Bad Request"
            });
        };

        const { email, password } = req.body;

        const user = await userModel
            .findOne({ email })
            .select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account Does Not Exist"
            });
        }

        const passMatch = await bycrpt.compare(password, user.password);

        if (!passMatch) {
            return res.status(401).json({
                success: false,
                message: "Wrong Password"
            });
        };

        if (!user.verified) {
            return res.status(401).json({
                code: "NOT_VERIFIED",
                success: false,
                message: "Account Not Verified"
            });
        };

        if (user.status === "inactive") {
            return res.status(401).json({
                code: "ACCESS_BLOCKED",
                success: false,
                message: "Account Blocked"
            });
        };

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE, }
        );

        user.lastLogin = new Date();
        await user.save();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login Successful",
        });

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }
};

const verifyEmail = async (req, res) => {

    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Bad Request"
            });
        };

        const { email } = req.body;

        const user = await userModel
            .findOne({ email })
            .select("+otp +otpExpiresAt");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account Does Not Exist"
            });
        };

        if (user.verified) {
            return res.status(400).json({
                code: "ALREADY_VERIFIED",
                success: false,
                message: "Email is already verified"
            });
        };

        const currentTime = new Date();

        if (user.otpExpiresAt && user.otpExpiresAt > currentTime) {

            const expiryTime = user.otpExpiresAt.toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })

            return res.status(429).json({
                success: false,
                message: `Email already sent. Please wait until ${expiryTime}.`
            });
        }

        // Secure 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // HASH OTP
        const hashedOtp = await bycrpt.hash(otp, 10);

        // Mail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-account`;

        // EMAIL SEND
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `${process.env.SITE_NAME} - Verify Your Account`,
            html: verifyAccountEmail(user.fullName, verifyUrl)
        };

        await transporter.sendMail(mailOptions);

        user.otp = hashedOtp;
        user.otpExpiresAt = new Date(
            currentTime.getTime() + 60 * 1000
        );

        await user.save();

        res.cookie("verifyAccToken", hashedOtp, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            success: true,
            message: "Verification email sent successfully"
        });

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }
};

const verifyAccount = async (req, res) => {

    try {

        const verifyToken = req.cookies.verifyAccToken;

        const user = await userModel
            .findOne({ otp: verifyToken })
            .select("+otp +otpExpiresAt");

        if (!user) {
            return res.status(400).json({
                code: "ACCESS_DENIED",
                success: false,
                message: "Invalid or expired verification token"
            });
        };

        if (user.verified) {
            return res.status(400).json({
                code: "ALREADY_VERIFIED",
                success: false,
                message: "Account is already verified"
            });
        };

        if (verifyToken !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid Verification Request"
            });
        }

        user.verified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.clearCookie("verifyAccToken");

        return res.status(200).json({
            code: "ACCOUNT_VERIFIED",
            success: true,
            message: "Account verified successfully"
        });

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }
};

export {
    signup,
    login,
    verifyEmail,
    verifyAccount,
}