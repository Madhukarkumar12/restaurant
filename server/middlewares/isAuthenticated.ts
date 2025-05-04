import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend Express.Request to include `id`
declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}

interface JwtPayloadWithUserId extends jwt.JwtPayload {
    userId: string;
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.token;
        console.log("Token:",token);

        if (!token) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayloadWithUserId;

        if (!decoded?.userId) {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }

        req.id = decoded.userId;
        next();
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
