import userModel from "../models/user.model.js";

const uploadFile = async (req, res) => {

    try {

        const token = req.headers.authorization;
        const { fileName, folderId, storageKey, mimeType, fileSize } = req.body;

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id);
        console.log(user);



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
}