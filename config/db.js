import mongoose from "mongoose";

const ConnectDB = async () => {

    try {
        await mongoose.connect(`${process.env.DB_URI}/secure_share`);
        console.log("DB Connected");
    } catch (err) {
        console.log("DB Connection Failed");
        process.exit(1);
    }
};

export default ConnectDB;