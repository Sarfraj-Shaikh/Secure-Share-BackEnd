const fetchSharedFile = async (req, res) => {

    try {

    } catch (err) {

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something Went Wrong.",
        });

    }

};

export {
    fetchSharedFile,
}