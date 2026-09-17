import mongoose from "mongoose";
import dns from "dns";

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const ConnectDB = async () => {

    try {
        await mongoose.connect(process.env.DB_URI, {
            family: 4,
            serverSelectionTimeoutMS: 10000,
        });
        // await mongoose.connect(process.env.DB_URI);
        console.log("DB Connected");
    } catch (err) {
        console.log("DB Connection Failed");
        console.log(err);

        process.exit(1);
    }
};

export default ConnectDB;