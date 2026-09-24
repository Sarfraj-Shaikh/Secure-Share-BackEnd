import multer from "multer";
import mongoose from "mongoose";

const storage = multer.memoryStorage();

const multerUpload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
});

const uploadSingleFile = (req, res, next) => {

    multerUpload.single("file")(req, res, (err) => {

        if (err instanceof multer.MulterError) {

            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "File size cannot exceed 10 MB",
                });
            }

            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        next();
    });
};


const uploadFileVal = async (req, res, next) => {

    try {

        const { fileName, folderId } = req.body;

        if (!fileName || fileName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "File Name Is Required",
            });
        }

        if (!folderId || folderId.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Folder ID Is Required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File Is Required",
            });
        }

        next();

    } catch (err) {

        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });

    }
};

const UpdateFileVal = async (req, res, next) => {

    try {

        const fileId = req.params.id;

        if (!fileId || fileId.trim() === "") {
            return res.status(400).json({
                success: false,
                code: "FILE_ID_REQUIRED",
                message: "File ID is required.",
            });
        };

        if (!mongoose.isValidObjectId(fileId)) {
            return res.status(400).json({
                success: false,
                code: "INVALID_FILE_ID",
                message: "Invalid File ID.",
            });
        };

        const { fileName, folderId, password, expiresAt } = req.body;

        // At least one field must be provided
        if (fileName === undefined &&
            folderId === undefined &&
            password === undefined &&
            expiresAt === undefined
        ) {
            return res.status(400).json({
                success: false,
                code: "UPDATE_FIELD_REQUIRED",
                message: "At least one field is required to update.",
            });
        };

        if (fileName !== undefined) {

            if (typeof fileName !== "string" || fileName.trim() === "") {
                return res.status(400).json({
                    success: false,
                    code: "INVALID_FILE_NAME",
                    message: "File name must be a non-empty string.",
                });
            }
        };

        if (folderId !== undefined) {

            if (typeof folderId !== "string" || folderId.trim() === "") {
                return res.status(400).json({
                    success: false,
                    code: "INVALID_FOLDER_ID",
                    message: "Folder ID must be a non-empty string.",
                });
            }
        };

        if (password !== undefined) {

            if (typeof password !== "string" || password.trim() === "") {
                return res.status(400).json({
                    success: false,
                    code: "INVALID_FILE_PASSWORD",
                    message: "File Password must be a non-empty string.",
                });
            }
        };

        if (expiresAt !== undefined) {

            if (typeof expiresAt !== "string" || expiresAt.trim() === "") {
                return res.status(400).json({
                    success: false,
                    code: "INVALID_FILE_EXPIRY",
                    message: "Expiry Date must be a non-empty date.",
                });
            }
        };


        next();

    } catch (err) {

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: err.message
        });

    }
};

const DeleteFileVal = async (req, res, next) => {

    try {

        const fileId = req.params.id;

        if (!fileId || fileId.trim() === "") {
            return res.status(400).json({
                success: false,
                code: "FILE_ID_REQUIRED",
                message: "File ID is required.",
            });
        }

        if (!mongoose.isValidObjectId(fileId)) {
            return res.status(400).json({
                success: false,
                code: "INVALID_FILE_ID",
                message: "Invalid File ID.",
            });
        }

        next();

    } catch (err) {

        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });

    }

};

export {
    uploadSingleFile,
    uploadFileVal,
    UpdateFileVal,
    DeleteFileVal,
};