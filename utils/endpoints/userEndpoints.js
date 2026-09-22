import { CreateFolder } from "../../controllers/folder.controller.js";
import {
    changePass,
    login, passEmail, signup, userIsAuth, verifyAccount, verifyEmail,
    verifyOtp
} from "../../controllers/user.controller.js"
import { CreateFolderVal } from "../../middlewares/folder.middleware.js";
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

}