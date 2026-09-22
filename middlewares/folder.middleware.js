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

export {
    CreateFolderVal,
}