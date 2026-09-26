import { deleteFile, fetchFiles, shareFile, updateFile, uploadFile } from "../../controllers/files.controller.js";
import { CreateFolder, DeleteFolder, FetchFavFolder, FetchFolder, UpdateFolder } from "../../controllers/folder.controller.js";
import {
    changePass,
    login, passEmail, signup, userIsAuth, verifyAccount, verifyEmail,
    verifyOtp
} from "../../controllers/user.controller.js"
import { roleValidation } from "../../middlewares/authorization.middleware.js";
import { DeleteFileVal, fetchFileVal, shareFileVal, UpdateFileVal, uploadFileVal, uploadSingleFile } from "../../middlewares/files.middleware.js";
import { CreateFolderVal, DeleteFolderVal, UpdateFolderVal } from "../../middlewares/folder.middleware.js";
import {
    emailVal, loginVal, otpVal, passVal, signupVal, userIsAuthVal, verifyAccVal
} from "../../middlewares/user.middleware.js"
import { changePassLimiter, emailLimiter, loginLimiter, otpLimiter, signupLimiter, verifyAccLimiter, verifyOtpLimiter } from "../rateLimiter/authentication.ratelimiter.js";
import { userIsAuthLimiter } from "../rateLimiter/isAuth.ratelimiter.js";

export const userEnpoints = (app) => {

    app.post("/api/signup", signupLimiter, signupVal, signup);
    app.post("/api/login", loginLimiter, loginVal, login);
    app.post("/api/verify", emailLimiter, emailVal, verifyEmail);
    app.post("/api/verify-account", verifyAccLimiter, verifyAccVal, verifyAccount);
    app.post("/api/reset-password", otpLimiter, emailVal, passEmail);
    app.post("/api/verify-otp", verifyOtpLimiter, otpVal, verifyOtp);
    app.post("/api/change-password", changePassLimiter, passVal, changePass);
    app.post("/api/isAuth", userIsAuthLimiter, userIsAuthVal, userIsAuth);

    app.post("/api/folders", CreateFolderVal, CreateFolder);
    app.get("/api/folders", roleValidation, FetchFolder);
    app.put("/api/folders/:id", UpdateFolderVal, roleValidation, UpdateFolder);
    app.delete("/api/folders/:id", DeleteFolderVal, roleValidation, DeleteFolder);

    app.get("/api/fav-folders", roleValidation, FetchFavFolder);

    app.post("/api/file", roleValidation, uploadSingleFile, uploadFileVal, uploadFile);
    app.get("/api/file", roleValidation, fetchFileVal, fetchFiles);
    app.put("/api/file/:id", UpdateFileVal, roleValidation, updateFile);
    app.delete("/api/file/:id", DeleteFileVal, roleValidation, deleteFile);

    app.post("/api/share-file", roleValidation, shareFileVal, shareFile);

    app.get("/api/share-file", roleValidation, )

}