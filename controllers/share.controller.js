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
            })
        };

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

        return res.status(200).json({
            success: true,
            message: "Files Fetched Successfully.",
            files: responseFiles,
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

export {
    fetchSharedFile,
}