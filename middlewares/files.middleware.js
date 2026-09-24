const uploadFileVal = async (req, res, next) => {

    try {

        const { fileName, folderId, storageKey, mimeType, fileSize } = req.body;

        if (!fileName || fileName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "File Name Is Required",
            });
        };

        if (!folderId || folderId.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Folder ID Is Required",
            });
        };

        if (!storageKey || storageKey.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Storage Key Is Required",
            });
        };

        if (!mimeType || mimeType.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Mime Type Is Required",
            });
        };

        if (!fileSize || fileSize.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "File Size Is Required",
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

export {
    uploadFileVal,
}