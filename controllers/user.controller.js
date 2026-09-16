import userModel from "../models/user.model.js";
import bycrpt from "bcrypt"

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

export {
    signup,
}