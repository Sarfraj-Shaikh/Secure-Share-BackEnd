import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import filesModel from "../models/files.model.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "auto", },
            (error, result) => {

                if (error) {

                    reject(error);

                } else {

                    resolve(result);

                }
            }
        );

        stream.end(fileBuffer);
    });
};

const uploadFile = async (req, res) => {

    try {

        const token = req.headers.authorization;

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        const { fileName, folderId } = req.body;
        const file = req.file;

        if (file.size > 10 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: "File size cannot exceed 10 MB",
            });
        }

        if (user.usedStorage + file.size > user.storageLimit) {
            return res.status(400).json({
                success: false,
                message: "Storage Full Limit Exceed",
            });
        }

        const cloudinaryResult = await uploadToCloudinary(file.buffer, `users/${user._id}/files`);

        const newFile = await filesModel.create({
            folderId,
            userId: user._id,
            fileName,
            storageKey: cloudinaryResult.public_id,
            mimeType: file.mimetype,
            fileSize: file.size,
            fileLink: cloudinaryResult.secure_url,
        });

        if (newFile) {
            user.usedStorage += file.size
            await user.save();
        }

        // 7. Response
        return res.status(201).json({
            success: true,
            message: "File Uploaded Successfully",
            file: newFile,
        });

    } catch (err) {

        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });

    }
};

const fetchFiles = async (req, res) => {

    try {

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const limit = 10;
        const pageNo = Math.max(Number(req.query.page) || 1, 1);
        const skip = (pageNo - 1) * limit;

        const filter = { userId: decodedToken.id, };

        const [folders, totalDocs] = await Promise.all([
            filesModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            filesModel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalDocs / limit);

        return res.status(200).json({
            success: true,
            message: "Files Fetched Successfully.",
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

const updateFile = async (req, res) => {

    try {

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const fileId = req.params.id;
        const { fileName, folderId, password, expiresAt } = req.body;

        const updatePayload = {};

        if (fileName !== undefined) {
            updatePayload.fileName = fileName.trim();
        }

        if (folderId !== undefined) {
            updatePayload.folderId = folderId.trim();
        }

        if (password !== undefined) {
            updatePayload.password = password.trim();
        }

        if (expiresAt !== undefined) {
            updatePayload.expiresAt = expiresAt.trim();
        }

        const files = await filesModel
            .findOneAndUpdate(
                { _id: fileId, userId: decodedToken.id },
                { $set: updatePayload },
                { new: true, runValidators: true }
            );

        if (!files) {
            return res.status(404).json({
                success: false,
                code: "FILE_NOT_FOUND",
                message: "File not found.",
            });
        };

        return res.status(200).json({
            success: true,
            message: "File Updated Successfully.",
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something Went Wrong.",
        });

    }

};

const deleteFile = async (req, res) => {

    try {

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const fileId = req.params.id;

        const folder = await filesModel.findOneAndDelete({ _id: fileId, userId: decodedToken.id, });

        if (!folder) {
            return res.status(404).json({
                success: false,
                code: "FILE_NOT_FOUND",
                message: "File not found.",
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
    uploadFile,
    uploadToCloudinary,
    fetchFiles,
    updateFile,
    deleteFile
};