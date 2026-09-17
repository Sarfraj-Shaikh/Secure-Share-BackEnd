import dotenv from "dotenv"
dotenv.config();

import express from "express";
import ConnectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userEnpoints } from "./utils/endpoints/userEndpoints.js";
import { adminEnpoints } from "./utils/endpoints/adminEndpoints.js";

const app = express();
ConnectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL, // frontend URL
    credentials: true
}));

userEnpoints(app);
adminEnpoints(app);

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Invalid API Request"
    });

});

// const PORT = process.env.PORT || 8080;

// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });


export default app;