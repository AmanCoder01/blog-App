import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token not available",
        });
    }

    jwt.verify(token, process.env.JWTSECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        req.user = user;
        next();
    });
};