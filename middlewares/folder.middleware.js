const CreateFolderVal = async (req, res, next) => {

    try {

        const { name, color, token } = req.body;

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

        if (!token || token.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "User Token Is Required",
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