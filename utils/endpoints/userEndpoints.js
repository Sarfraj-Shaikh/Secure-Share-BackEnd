import {
    login, passEmail, signup, verifyAccount, verifyEmail,
    verifyOtp
} from "../../controllers/user.controller.js"
import {
    emailVal, loginVal, otpVal, signupVal, verifyAccVal
} from "../../middlewares/user.middleware.js"

export const userEnpoints = (app) => {

    app.post("/api/signup", signupVal, signup);
    app.post("/api/login", loginVal, login);
    app.post("/api/verify", emailVal, verifyEmail);
    app.post("/api/verify-account", verifyAccVal, verifyAccount);
    app.post("/api/reset-password", emailVal, passEmail);
    app.post("/api/verify-otp", otpVal, verifyOtp);
    app.post("/api/change-password", otpVal, verifyOtp);

}