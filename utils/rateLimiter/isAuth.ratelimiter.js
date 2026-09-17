import rateLimit from "express-rate-limit";

const userIsAuthLimiter = rateLimit({

    windowMs: 60 * 1000, // 1 minute
    limit: 100,

    standardHeaders: "draft-7",
    legacyHeaders: false,

    handler: (req, res, next, options) => {

        const retryAfter = res.getHeader("Retry-After");
        let retryAfterSeconds = Number(retryAfter);

        // Fallback agar Retry-After available nahi hai
        if (!Number.isFinite(retryAfterSeconds)) {
            retryAfterSeconds = Math.ceil(options.windowMs / 1000);
        }

        const minutes = Math.floor(retryAfterSeconds / 60);
        const seconds = retryAfterSeconds % 60;

        let retryMessage;

        if (minutes > 0 && seconds > 0) {
            retryMessage = `${minutes} minute${minutes > 1 ? "s" : ""} ${seconds} second${seconds > 1 ? "s" : ""}`;
        } else if (minutes > 0) {
            retryMessage = `${minutes} minute${minutes > 1 ? "s" : ""}`;
        } else {
            retryMessage = `${seconds} second${seconds > 1 ? "s" : ""}`;
        }

        return res.status(options.statusCode).json({
            code: "TOO_MANY_REQUEST",
            success: false,
            message: `Too many requests. Please try again after ${retryMessage}.`,
            retryAfterSeconds
        });
    }
});

export {
    userIsAuthLimiter,
}