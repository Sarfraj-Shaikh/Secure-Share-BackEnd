import userModel from "../models/user.model.js";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { verifyAccountEmail } from "../templates/verifyAccount.js";
import { verifyOTPEmail } from "../templates/verifyOtp.js";

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
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
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
            .select("+otp +otpExpiresAt +token");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account Does Not Exist"
            });
        };

        if (user.status === "inactive") {
            return res.status(401).json({
                code: "ACCESS_BLOCKED",
                success: false,
                message: "Account Blocked"
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

        // Secure Verification Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE, }
        );

        // Mail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-account?token=${token}`;

        // EMAIL SEND
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `${process.env.SITE_NAME} - Verify Your Account`,
            html: verifyAccountEmail(user.fullName, verifyUrl)
        };

        await transporter.sendMail(mailOptions);

        user.otpExpiresAt = new Date(
            currentTime.getTime() + 60 * 1000
        );

        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "Verification Email Sent Successfully"
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

        const { token } = req.query;

        let decodedToken;

        try {

            decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        } catch (err) {

            return res.status(400).json({
                code: "ACCESS_DENIED",
                success: false,
                message: "Invalid or expired token"
            });

        }

        const user = await userModel
            .findById(decodedToken?.id)
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

        user.verified = true;
        user.otpExpiresAt = null;
        await user.save();

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

const passEmail = async (req, res) => {

    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Bad Request"
            });
        }

        const { email } = req.body;

        const user = await userModel
            .findOne({ email })
            .select("+otp +otpExpiresAt");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account Does Not Exist"
            });
        }

        if (user.status === "inactive") {
            return res.status(400).json({
                code: "ACCESS_BLOCKED",
                success: false,
                message: "Your Account Is Blocked"
            });
        }

        const currentTime = new Date();

        // If previous OTP is still valid
        if (user.otpExpiresAt && user.otpExpiresAt > currentTime) {
            const expiryTime = user.otpExpiresAt.toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });

            return res.status(429).json({
                success: false,
                message: `OTP already sent. Please wait until ${expiryTime}.`
            });
        }

        // 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // OTP valid for 5 minutes
        const otpExpiresAt = new Date(currentTime.getTime() + 5 * 60 * 1000);

        // Save OTP in DB
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;

        await user.save();

        // Mail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `${process.env.SITE_NAME} - Verify Your OTP`,
            html: verifyOTPEmail(user.fullName, otp)
        };

        try {

            await transporter.sendMail(mailOptions);

        } catch (mailError) {

            // Email failed, remove OTP from DB
            user.otp = undefined;
            user.otpExpiresAt = undefined;

            await user.save();

            return res.status(500).json({
                code: "EMAIL_SEND_FAILED",
                success: false,
                message: "Unable to send verification email"
            });
        }

        // Cookie valid for exactly 5 minutes
        const cookieMaxAge = 500 * 60 * 1000;

        res.cookie("email", user.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            path: "/",
            maxAge: cookieMaxAge
        });

        return res.status(200).json({
            success: true,
            message: "OTP email sent successfully"
        });

    } catch (err) {

        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });

    }
};

const verifyOtp = async (req, res) => {

    try {

        const userEmail = req.cookies.email;
        const { otp } = req.body;

        const user = await userModel
            .findOne({ email: userEmail })
            .select("+otp +otpExpiresAt");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account Does Not Exist"
            });
        }

        if (user.status === "inactive") {
            return res.status(400).json({
                code: "ACCESS_BLOCKED",
                success: false,
                message: "Your Account Is Blocked"
            });
        };

        if (!user.otp) {
            return res.status(400).json({
                code: "ACCESS_DENIED",
                success: false,
                message: "Invalid or expired code"
            });
        };

        const currentTime = new Date();

        if (user.otpExpiresAt && user.otpExpiresAt < currentTime) {
            return res.status(429).json({
                success: false,
                message: `Code Has Been Expired. Please Try Again`
            });
        };

        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Wrong Code"
            });
        };

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }
};

const changePass = async (req, res) => {

    try {

        const userEmail = req.cookies.email;
        const { password } = req.body;

        const user = await userModel
            .findOne({ email: userEmail })
            .select("+otp +otpExpiresAt");

        if (!user) {
            return res.status(400).json({
                code: "ACCESS_DENIED",
                success: false,
                message: "Invalid Request"
            });
        };

        if (user.status === "inactive") {
            return res.status(400).json({
                code: "ACCESS_BLOCKED",
                success: false,
                message: "Your Account Is Blocked"
            });
        };

        if (user.otp === null || user.otpExpiresAt === null) {
            return res.status(400).json({
                success: false,
                message: "Request Not Allowed"
            });
        };

        const hashPass = await bycrpt.hash(password, 10);

        user.password = hashPass;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.clearCookie("email");

        return res.status(200).json({
            code: "PASSWORD_CHANGED",
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }
};

const userIsAuth = async (req, res) => {

    try {

        const userToken = req.cookies.token;
        const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET, { algorithms: ["HS256"] });

        const user = await userModel
            .findById(decodedToken.id)
            .select("_id name email status verified role reason");

        if (!user) {
            return res.status(401).json({
                success: false,
                code: "USER_NOT_FOUND",
                message: "User does not exist."
            });
        };

        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                code: "ACCESS_BLOCKED",
                message: "Your account is blocked.",
                user: {
                    role: user.role,
                    reason: user.reason
                }
            });
        };

        if (!user.verified) {
            return res.status(401).json({
                success: false,
                code: "NOT_VERIFIED",
                message: "Your account is not verified."
            });
        };

        return res.status(200).json({
            success: true,
            code: "AUTHENTICATED",
            message: "User is authenticated.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (err) {

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                code: "TOKEN_EXPIRED",
                message: "Your session has expired. Please login again."
            });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                code: "INVALID_TOKEN",
                message: "Invalid authentication token."
            });
        }

        console.error("userIsAuth error:", err);

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something went wrong."
        });
    }
};

export {
    signup,
    login,
    verifyEmail,
    verifyAccount,
    passEmail,
    verifyOtp,
    changePass,
    userIsAuth,
}
