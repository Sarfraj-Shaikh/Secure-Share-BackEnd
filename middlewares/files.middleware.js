import multer from "multer";

const storage = multer.memoryStorage();

const multerUpload = multer({
    storage,
    limits: {
        fileSize: 1 * 1024 * 1024, // 1 MB
    },
});

const uploadSingleFile = (req, res, next) => {

    multerUpload.single("file")(req, res, (err) => {

        if (err instanceof multer.MulterError) {

            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "File size cannot exceed 1 MB",
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

export {
    uploadSingleFile,
    uploadFileVal,
};