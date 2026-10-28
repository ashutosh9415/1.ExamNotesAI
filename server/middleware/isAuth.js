import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                message: "Token not found"
            });
        }

        const verifyToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = verifyToken.userId;

        next();

    } catch (error) {
        console.log("isAuth error:", error.message);

        return res.status(401).json({
            message: `isAuth error: ${error.message}`
        });
    }
};

export default isAuth;