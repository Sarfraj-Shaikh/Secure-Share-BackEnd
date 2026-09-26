import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import shareModel from "../models/share.model.js";
import filesModel from "../models/files.model.js";
import mongoose from "mongoose";

const fetchSharedFile = async (req, res) => {

    try {

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const pageNo = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 10);
        const skip = (pageNo - 1) * limit;
        const filter = req.query.filter;

        const sortOrder = filter === "Oldest" ? 1 : -1;

        const files = await shareModel
            .find({ userId: user._id })
            .populate("fileId", "fileName mimetype fileSize password expiresAt")
            .sort({ createdAt: sortOrder })
            .skip(skip)
            .limit(limit + 1);

        const isLoadMore = files.length > limit;
        const responseFiles = files.slice(0, limit);

        const maskedFiles = responseFiles.map((file) => {

            const fileObj = file.toObject();
            if (fileObj.receiverEmail) { fileObj.receiverEmail = maskEmail(fileObj.receiverEmail); }
            return fileObj;

        });

        return res.status(200).json({
            success: true,
            message: "Files Fetched Successfully.",
            files: maskedFiles,
            currentPage: pageNo,
            isLoadMore
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something Went Wrong."
        });

    }

};

const maskEmail = (email) => {

    if (!email || typeof email !== "string") return email;

    const [username, domain] = email.split("@");

    if (!username || !domain) return email;

    if (username.length <= 2) {
        return `${username[0]}*@${domain}`;
    }

    if (username.length <= 4) {
        return `${username[0]}${"*".repeat(username.length - 1)}@${domain}`;
    }

    const visibleStart = username.slice(0, 2);
    const visibleEnd = username.slice(-2);
    const maskedLength = username.length - 4;

    return `${visibleStart}${"*".repeat(maskedLength)}${visibleEnd}@${domain}`;

};

const getSharedFile = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const { id: fileId } = req.params;

        if (!mongoose.isValidObjectId(fileId)) {
            return res.status(400).json({
                success: false,
                code: "INVALID_FILE_ID",
                message: "Invalid File ID.",
            });
        }

        const user = await userModel.findById(decodedToken.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found",
            });
        }

        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: "Your account is not verified",
            });
        }

        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active",
            });
        }

        const file = await filesModel.findById(fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "Invalid File",
            });
        }

        if (
            file.expiresAt &&
            new Date(file.expiresAt) <= new Date()
        ) {
            return res.status(410).json({
                success: false,
                message: "This file has expired",
            });
        }

        const sharedFile = await shareModel.findOne({
            fileId: file._id,
            receiverEmail: user.email,
        });

        if (!sharedFile) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to access this file",
            });
        }

        return res.status(200).json({
            success: true,
            message: "File access verified",
            data: {
                fileId: file._id,
                fileName: file.fileName,
                fileSize: file.fileSize,
                mimeType: file.mimeType,
                passwordRequired: Boolean(file.password),
                expiryDate: file.expiresAt,
            },
        });

    } catch (err) {
        console.error("getSharedFile error:", err);

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization token",
            });
        }

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Authorization token expired",
            });
        }

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something Went Wrong.",
        });
    }
};

const downloadSharedFile = async (req, res) => {
    try {
        const { id: fileId } = req.params;
        const { password } = req.body;

        if (!mongoose.isValidObjectId(fileId)) {
            return res.status(400).json({
                success: false,
                code: "INVALID_FILE_ID",
                message: "Invalid File ID.",
            });
        }

        // ------------------------------------------------------------
        // Authentication
        // ------------------------------------------------------------

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization required.",
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: "Your account is not verified.",
            });
        }

        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active.",
            });
        }

        // ------------------------------------------------------------
        // File
        // ------------------------------------------------------------

        const file = await filesModel.findById(fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        // ------------------------------------------------------------
        // Expiry
        // ------------------------------------------------------------

        if (
            file.expiresAt &&
            new Date(file.expiresAt) <= new Date()
        ) {
            return res.status(410).json({
                success: false,
                message: "This file has expired.",
            });
        }

        // ------------------------------------------------------------
        // Share Permission
        // ------------------------------------------------------------

        const sharedFile = await shareModel.findOne({
            fileId: file._id,
            receiverEmail: user.email,
        });

        if (!sharedFile) {
            return res.status(403).json({
                success: false,
                message:
                    "You don't have permission to download this file.",
            });
        }

        // ------------------------------------------------------------
        // Password
        // ------------------------------------------------------------

        const passwordRequired = Boolean(file.password);

        if (passwordRequired) {

            if (!password || !password.trim()) {
                return res.status(400).json({
                    success: false,
                    code: "PASSWORD_REQUIRED",
                    message: "File password is required.",
                });
            }

            if (password !== file.password) {
                return res.status(401).json({
                    success: false,
                    code: "INVALID_PASSWORD",
                    message: "Incorrect file password.",
                });
            }
        }

        // ------------------------------------------------------------
        // Cloudinary URL
        // ------------------------------------------------------------

        if (!file.fileLink) {
            return res.status(404).json({
                success: false,
                message: "File link not found.",
            });
        }

        const downloadUrl = file.fileLink.replace("/upload/", "/upload/fl_attachment/");

        return res.status(200).json({
            success: true,
            message: "File is ready for download.",
            downloadUrl,
            fileName: file.fileName,
        });

    } catch (error) {

        console.error(
            "downloadSharedFile error:",
            error
        );

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization token.",
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Authorization token expired.",
            });
        }

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Unable to download file.",
        });
    }
};

export {
    fetchSharedFile,
    getSharedFile,
    downloadSharedFile,
}
