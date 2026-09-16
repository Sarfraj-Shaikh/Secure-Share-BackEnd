import { login, signup } from "../../controllers/user.controller.js"
import { loginVal, signupVal } from "../../middlewares/user.middleware.js"

export const userEnpoints = (app) => {
    
    app.post("/api/signup", signupVal, signup);
    app.post("/api/login", loginVal, login);

}