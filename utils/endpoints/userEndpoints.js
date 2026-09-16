import { signup } from "../../controllers/user.controller.js"
import { signupVal } from "../../middlewares/user.middleware.js"

export const userEnpoints = (app) => {
    
    app.post("/api/signup", signupVal, signup);
}