import { Schema, model } from "mongoose";

const folderSchema = new Schema({

    name: {
        type: String,
        required: [true, "Folder Name Is Required"],
        trim: true,
        lowercase: true,
        minlength: [2, "Folder Name must be at least 2 characters"],
        maxlength: [100, "Folder Name cannot exceed 100 characters"],
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        required: [true, "Folder Color Is Required"],
        trim: true,
        lowercase: true,
        minlength: [4, "Folder Color must be at least 3 characters"],
        maxlength: [7, "Folder Color cannot exceed 6 characters"],
    },
    totalFiles: {
        type: Number,
        default: 0,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User ID Is Required"],
    },

}, { timestamps: true });

export default model("folder", folderSchema);