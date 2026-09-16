import { login, signup, verifyAccount, verifyEmail } from "../../controllers/user.controller.js"
import { emailVal, loginVal, signupVal, verifyAccVal } from "../../middlewares/user.middleware.js"

export const userEnpoints = (app) => {
    
    app.post("/api/signup", signupVal, signup);
    app.post("/api/login", loginVal, login);
    app.post("/api/verify", emailVal, verifyEmail);
    app.post("/api/verify-account", verifyAccVal, verifyAccount);

}