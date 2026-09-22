import mongoose from "mongoose";

const CreateFolderVal = async (req, res, next) => {

    try {

        const token = req.headers.authorization;

        if (!token || token.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "User Token Is Required",
            });
        };

        const { name, color } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Folder Name Is Required",
            });
        };

        if (!color || color.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Folder Color Is Required",
            });
        };

        next();

    } catch (err) {

        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });

    }

};

const UpdateFolderVal = async (req, res, next) => {

    try {

        const folderId = req.params.id;

        if (!folderId || folderId.trim() === "") {
            return res.status(400).json({
                success: false,
                code: "FOLDER_ID_REQUIRED",
                message: "Folder ID is required.",
            });
        };

        if (!mongoose.isValidObjectId(folderId)) {
            return res.status(400).json({
                success: false,
                code: "INVALID_FOLDER_ID",
                message: "Invalid folder ID.",
            });
        };

        const { name, color, isFavorite } = req.body;

        // At least one field must be provided
        if (name === undefined && color === undefined && isFavorite === undefined) {
            return res.status(400).json({
                success: false,
                code: "UPDATE_FIELD_REQUIRED",
                message: "At least one field is required to update.",
            });
        };

        // Name validation
        if (name !== undefined) {

            if (typeof name !== "string" || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    code: "INVALID_FOLDER_NAME",
                    message: "Folder name must be a non-empty string.",
                });
            }
        };

        // Color validation
        if (color !== undefined) {

            if (typeof color !== "string" || color.trim() === "") {
                return res.status(400).json({
                    success: false,
                    code: "INVALID_FOLDER_COLOR",
                    message: "Folder color must be a non-empty string.",
                });
            }
        };

        // Favorite validation
        if (isFavorite !== undefined) {

            if (typeof isFavorite !== "boolean") {
                return res.status(400).json({
                    success: false,
                    code: "INVALID_FAVORITE_VALUE",
                    message: "isFavorite must be a boolean.",
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

const DeleteFolderVal = async (req, res, next) => {

    try {

        const folderId = req.params.id;

        if (!folderId || folderId.trim() === "") {
            return res.status(400).json({
                success: false,
                code: "FOLDER_ID_REQUIRED",
                message: "Folder ID is required.",
            });
        }

        if (!mongoose.isValidObjectId(folderId)) {
            return res.status(400).json({
                success: false,
                code: "INVALID_FOLDER_ID",
                message: "Invalid folder ID.",
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
    CreateFolderVal,
    UpdateFolderVal,
    DeleteFolderVal,
}