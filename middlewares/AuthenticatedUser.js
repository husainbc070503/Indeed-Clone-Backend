import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const AuthenticatedUser = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const data = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(data.userId).select("-password");
            next();

        } catch (error) {
            next(error.message);
        }
    } else {
        res.status(400).json({ success: false, message: "Unauthorized user" });
    }
}

export default AuthenticatedUser;
