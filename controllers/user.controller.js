import userModel from "../models/user.model.js";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";

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
}

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
}

export {
    signup,
    login,
}