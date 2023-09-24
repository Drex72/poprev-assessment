import rateLimit from "express-rate-limit";
import  moment from "moment";

//TODO: work on the limiting.
export const globalRateLimiter = rateLimit({
    windowMs: moment().add(12, 'hours').unix(), // 24 hrs in milliseconds
    max: 100,
    message: 'You have exceeded the 100 requests in 24 hrs limit!', 
    standardHeaders: true,
    legacyHeaders: false,
});

