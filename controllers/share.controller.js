import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import shareModel from "../models/share.model.js";

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
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const { fileId } = req.params;

        const user = await userModel.findById(decodedToken.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found",
            });
        };

        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: "Your account is not verified",
            });
        };

        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active",
            });
        };

        // Find file
        const file = await filesModel.findById(fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "Invalid File",
            });
        }

        // Check expiry
        if (file.expiresAt && new Date(file.expiresAt) <= new Date()) {
            return res.status(410).json({
                success: false,
                message: "This file has expired",
            });
        }

        // Check whether this file was shared with requesting user
        const sharedFile = await shareModel.findOne({
            fileId: fileId,
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

        console.error("error:", err);

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

    };

};

const downloadSharedFile = async (req, res) => {

    try {

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const { fileId } = req.params;
        const { password } = req.body;

        const user = await userModel.findById(decodedToken.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found",
            });
        };

        // Account checks
        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: "Your account is not verified",
            });
        };

        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active",
            });
        };

        // Find file
        const file = await filesModel.findById(fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "Invalid File",
            });
        };

        // Expiry check
        if (file.expiresAt && new Date(file.expiresAt) <= new Date()) {
            return res.status(410).json({
                success: false,
                message: "This file has expired",
            });
        };

        // Check share permission
        const sharedFile = await shareModel.findOne({
            fileId: fileId,
            receiverEmail: user.email,
        });

        if (!sharedFile) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to download this file",
            });
        }

        // Password protected file
        if (file.password) {

            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: "File password is required",
                });
            };

            if (password !== file.password) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect file password",
                });
            };

        };

        if (!file.fileLink) {
            return res.status(404).json({
                success: false,
                message: "File Path Not Found",
            });
        }

        return res.download(
            file.fileLink, file.fileName,
            (err) => {
                if (err) {
                    if (!res.headersSent) {
                        return res.status(500).json({
                            success: false,
                            message: "Unable to download file",
                        });
                    }
                }
            }
        );

    } catch (err) {

        console.error("downloadSharedFile error:", err);

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

export {
    fetchSharedFile,
    getSharedFile,
    downloadSharedFile,
}
