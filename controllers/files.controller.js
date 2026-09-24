import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import filesModel from "../models/files.model.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto",
            },
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

        if (user.usedStorage >= user.storageLimit) {
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

        if(newFile) {
            user.usedStorage += file.size
            user.save();
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

export {
    uploadFile,
    uploadToCloudinary,
};