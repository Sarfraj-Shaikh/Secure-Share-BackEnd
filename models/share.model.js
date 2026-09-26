import { Schema, Types, model } from "mongoose";

const shareSchema = new Schema({

    fileId: {
        type: Schema.Types.ObjectId,
        ref: "file",
        required: [true, "File ID Is Required"],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User ID Is Required"],
    },
    receiverEmail: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        minlength: [2, "Email must be at least 2 characters"],
        index: true,
    },

}, { timestamps: true });

export default model("share", shareSchema);