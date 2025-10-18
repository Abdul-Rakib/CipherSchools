// middleware/auth.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // Try to get token from cookie first, then fall back to Authorization header
    const token = req.cookies.token;
    // console.log(token);
    
    if (!token) return res.status(401).json({ success: false, msg: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, msg: "Session Expired" });
        }
        res.status(401).json({ success: false, msg: "Invalid Token" });
    }
};