import { Schema, model } from "mongoose";

const fileSchema = new Schema({

    folderId: {
        type: Schema.Types.ObjectId,
        ref: "folder",
        required: [true, "Folder ID Is Required"],
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },

    fileName: {
        type: String,
        required: [true, "File Name Is Required"],
        trim: true,
        minlength: [2, "File Name must be at least 2 characters"],
        maxlength: [300, "File Name cannot exceed 300 characters"],
    },

    // Actual storage location
    storageKey: {
        type: String,
        required: [true, "Storage Key Is Required"],
        unique: true,
    },

    // MIME type: image/png, application/pdf, video/mp4 etc.
    mimeType: {
        type: String,
        required: [true, "MIME Type Is Required"],
        trim: true,
        lowercase: true,
    },

    fileSize: {
        type: Number,
        required: [true, "File Size Is Required"],
        min: [1, "File Size must be greater than 0"],
    },

    downloads: {
        type: Number,
        default: 0,
        min: 0,
    },

    shares: {
        type: Number,
        default: 0,
        min: 0,
    },

    expiresAt: {
        type: Date,
        default: null,
    },

    password: {
        type: String,
        default: null,
    },

}, {
    timestamps: true
});

export default model("file", fileSchema);