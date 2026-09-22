import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const roleValidation = async (req, res, next) => {

    try {

        const token = req.headers.authorization;

        if (!token || token.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "User Token Is Required",
            });
        };

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel
            .findById(decodedToken.id)
            .select("reason role");

        if (!user) {
            return res.status(404).json({
                success: false,
                code: "USER_NOT_FOUND",
                message: "User not found.",
            });
        };

        if (!["user", "admin", "superAdmin"].includes(user.role)) {
            return res.status(403).json({
                success: false,
                code: "FORBIDDEN",
                message: "You don't have access.",
            });
        };

        next();

    } catch (err) {

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                code: "TOKEN_EXPIRED",
                message: "Token Has Expired."
            });
        };

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                code: "INVALID_TOKEN",
                message: "Invalid Authentication Token."
            });
        };

        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });

    }

};

export {
    roleValidation,
}