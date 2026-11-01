import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import prisma from "../config/prisma.js";

export async function authenticateApiKey(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const apiKey = req.header("x-api-key");

        if (!apiKey) {
            return res.status(401).json({
                message: "API key is required"
            });
        }

        const keyHash = crypto
            .createHash("sha256")
            .update(apiKey)
            .digest("hex");

        const keyRecord = await prisma.api_keys.findUnique({
            where: {
                key_hash: keyHash
            }
        });

        if (
            !keyRecord ||
            keyRecord.revoked_at ||
            (keyRecord.expires_at && keyRecord.expires_at <= new Date())
        ) {
            return res.status(401).json({
                message: "Invalid or expired API key"
            });
        }

        req.user = {
            id: keyRecord.user_id,
            email: ""
        }


        void await prisma.api_keys.update({
            where: { id: keyRecord.id },
            data: { last_used_at: new Date() }
        }).catch(console.error);

        next();

    } catch (error) {
        next(error);
    }
}