import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../services/token.service.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const token = authHeader.split(" ")[1];
    if (token) {
        try {
            const decoded = verifyToken(token);
            if (typeof decoded === "string" || !decoded || !decoded.sub) {
                return res.status(401).json({
                    message: "Invalid token payload"
                });
            }
            req.user = {
                id: decoded.sub,
                email: decoded.email as string
            };

            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            return res.status(401).json({
                message: "Invalid or expired token",
                error: error
            });
        }
    }
};