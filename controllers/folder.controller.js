import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import folderModel from "../models/folder.model.js";

const CreateFolder = async (req, res) => {

    try {
        const { name, color, token } = req.body;

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel
            .findById(decodedToken.id)
            .select("_id totalFolders usedFolders status reason role");

        if (!user) {
            return res.status(404).json({
                success: false,
                code: "USER_NOT_FOUND",
                message: "User not found.",
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

        if (user.role !== "user" && user.role !== "admin" && user.role !== "superAdmin") {
            return res.status(403).json({
                success: false,
                code: "FORBIDDEN",
                message: "You can't create a folder.",
            });
        }

        if (user.usedFolders >= user.totalFolders) {
            return res.status(400).json({
                success: false,
                message: "Folders Limit Exceed",
            });
        };

        const folderPayload = {
            name: name,
            color: color,
            userId: user._id,

        };

        const folder = await folderModel.create(folderPayload);

        if (folder) {
            user.usedFolders += 1;
            await user.save();
        };

        res.status(201).json({
            message: "Folder Created Successful"
        });


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
            success: false,
            code: "SERVER_ERROR",
            message: "Something Went Wrong."
        });

    }

};

const FetchFolder = async (req, res) => {

    try {

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const limit = 10;
        const pageNo = Number(req.query.page) || 1;
        const skip = (pageNo - 1) * limit;

        const folders = await folderModel
            .find({ userId: decodedToken.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalDocs = await folderModel.countDocuments({ userId: decodedToken.id });
        const totalPages = Math.floor(totalDocs / limit);

        res.status(200).json({
            message: "Folders Fetched Successful",
            folders,
            totalPages,
        });


    } catch (err) {

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something Went Wrong."
        });

    }

};

export {
    CreateFolder,
    FetchFolder,
}