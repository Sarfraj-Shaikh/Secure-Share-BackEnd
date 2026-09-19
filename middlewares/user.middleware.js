const signupVal = (req, res, next) => {

    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Bad Request"
            });
        };

        const { fullName, email, mobileNumber, password } = req.body;

        if (!fullName || fullName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Fullname Is Required"
            });
        };

        if (fullName.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name must be at least 2 characters"
            });
        };

        if (fullName.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name cannot exceed 100 characters"
            });
        };

        if (!email || email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Email Is Required"
            });
        };

        if (/[\p{Extended_Pictographic}]/u.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Email cannot contain emojis"
            });
        };

        if (typeof email !== "string" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        };

        if (!mobileNumber || mobileNumber.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Mobile Number Is Required"
            });
        };

        if (!/^[6-9][0-9]{9}$/.test(mobileNumber.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit mobile number"
            });
        };

        if (!password || password.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Password Is Required"
            });
        };

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 uppercase character"
            });
        };

        if (!/[a-z]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 lowercase character"
            });
        };

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 number"
            });
        };

        if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];']/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 special character"
            });
        };


        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        };

        if (password.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Password cannot exceed 100 characters"
            });
        };

        next();

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }

};

const loginVal = (req, res, next) => {

    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Bad Request"
            });
        };

        const { email, password } = req.body;

        if (!email || email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Email Is Required"
            });
        };

        if (/[\p{Extended_Pictographic}]/u.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Email cannot contain emojis"
            });
        };

        if (typeof email !== "string" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        };

        if (!password || password.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Password Is Required"
            });
        };

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 uppercase character"
            });
        };

        if (!/[a-z]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 lowercase character"
            });
        };

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 number"
            });
        };

        if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];']/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 special character"
            });
        };

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        };

        if (password.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Password cannot exceed 100 characters"
            });
        };

        next();

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }

};

const emailVal = (req, res, next) => {

    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Bad Request"
            });
        };

        const { email } = req.body;

        if (typeof email !== "string" || email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Email Is Required"
            });
        };

        const cleanEmail = email.trim();

        if (/\p{Extended_Pictographic}/u.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Email cannot contain emojis"
            });
        };

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        };

        req.body.email = cleanEmail.toLowerCase();

        if (/[\p{Extended_Pictographic}]/u.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Email cannot contain emojis"
            });
        };

        if (typeof email !== "string" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        };

        next();

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }

};

const verifyAccVal = (req, res, next) => {

    try {

        const { token } = req.query;

        if (!token || typeof token !== "string" || token.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Verification Token Is Required"
            });
        }

        next();

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }

};

const otpVal = (req, res, next) => {

    try {

        const userEmail = req.cookies.email;

        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request"
            });
        };

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Bad Request"
            });
        };

        const { otp } = req.body;

        if (!otp || otp.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "OTP Is Required"
            });
        };

        const cleanOtp = otp.trim();

        if (cleanOtp.length !== 6) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        };

        if (!/^\d{6}$/.test(cleanOtp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        };

        next();

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }

};

const passVal = (req, res, next) => {

    try {

        const userEmail = req.cookies.email;

        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request"
            });
        };

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Bad Request"
            });
        };

        const { password } = req.body;

        if (!password || password.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Password Is Required"
            });
        };

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 uppercase character"
            });
        };

        if (!/[a-z]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 lowercase character"
            });
        };

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 number"
            });
        };

        if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];']/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least contain 1 special character"
            });
        };

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        };

        if (password.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Password cannot exceed 100 characters"
            });
        };

        next();

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }

};

const userIsAuthVal = (req, res, next) => {

    try {

        const userToken = req.cookies.token;

        if (!userToken) {
            return res.status(401).json({
                success: false,
                code: "UNAUTHORIZED",
                message: "Authentication token is required."
            });
        }

        next();

    } catch (err) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            success: false,
            message: err.message
        });
    }

};

export {
    signupVal,
    loginVal,
    emailVal,
    verifyAccVal,
    otpVal,
    passVal,
    userIsAuthVal,
}