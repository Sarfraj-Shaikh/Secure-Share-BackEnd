import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import folderModel from "../models/folder.model.js";

const CreateFolder = async (req, res) => {

    try {
        const { name, color } = req.body;

        const token = req.headers.authorization;
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
            success: true,
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
        const pageNo = Math.max(Number(req.query.page) || 1, 1);
        const skip = (pageNo - 1) * limit;

        const filter = { userId: decodedToken.id, };

        const [folders, totalDocs] = await Promise.all([
            folderModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            folderModel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalDocs / limit);

        return res.status(200).json({
            success: true,
            message: "Folders Fetched Successfully.",
            folders,
            currentPage: pageNo,
            totalPages,
            totalDocs,
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something Went Wrong."
        });

    }

};

const UpdateFolder = async (req, res) => {

    try {

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const folderId = req.params.id;
        const { name, color, isFavorite } = req.body;

        const updatePayload = {};

        if (name !== undefined) {
            updatePayload.name = name.trim();
        }

        if (color !== undefined) {
            updatePayload.color = color.trim();
        }

        if (isFavorite !== undefined) {
            updatePayload.isFavorite = isFavorite;
        }

        const folder = await folderModel
            .findOneAndUpdate(
                { _id: folderId, userId: decodedToken.id },
                { $set: updatePayload },
                { new: true, runValidators: true }
            );

        if (!folder) {
            return res.status(404).json({
                success: false,
                code: "FOLDER_NOT_FOUND",
                message: "Folder not found.",
            });
        };

        return res.status(200).json({
            success: true,
            message: "Folder Updated Successfully.",
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something Went Wrong.",
        });

    }

};

const DeleteFolder = async (req, res) => {

    try {

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const folderId = req.params.id;

        const folder = await folderModel.findOneAndDelete({ _id: folderId, userId: decodedToken.id, });

        if (!folder) {
            return res.status(404).json({
                success: false,
                code: "FOLDER_NOT_FOUND",
                message: "Folder not found.",
            });
        };

        const user = await userModel.findById(decodedToken.id);

        if (user) {
            user.usedFolders = Math.max(user.usedFolders - 1, 0);
            await user.save();
        };

        return res.status(200).json({
            success: true,
            message: "Folder Deleted Successfully.",
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something Went Wrong.",
        });

    }

};

export {
    CreateFolder,
    FetchFolder,
    UpdateFolder,
    DeleteFolder,
}