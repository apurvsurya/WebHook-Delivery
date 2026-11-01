import jwt from "jsonwebtoken";
import "dotenv/config";
import crypto from "node:crypto";
import { raw } from "@prisma/client/runtime/library";
import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

const secretKey = process.env.JWT_SECRET_KEY;

export function generateAccessToken(userId: string, email: string): string {

    var accessToken = "";

    if (secretKey) {

        accessToken = jwt.sign(
            {
                sub: userId,
                email: email
            },
            secretKey,
            {
                expiresIn: "15m",
                issuer: "webhhook-delivery",
                audience: "webhook-hub-client",
                algorithm: "HS256"
            }
        );
    }

    return accessToken;

}

export function verifyToken(token: string) {
    if (secretKey) {
        return jwt.verify(token, secretKey, {
            issuer: "webhhook-delivery",
            audience: "webhook-hub-client",
            algorithms: ["HS256"]
        });
    }
}

export interface DecodedJwt {

    "userId": string;
    "email": string;
    "iat": number;
    "exp": number;
    "iss": string;
    "aud": string;

}

export interface APIKeys {
    rawKey: string;
    hashKey: string;
}

//API_KEYS

export function generateAPIKeys(): APIKeys {
    const rawKey = `wh_prod_${crypto.randomBytes(32).toString('hex')}`;

    const hashedKey = crypto.createHash(("sha256")).update(rawKey).digest('hex');

    return {
        rawKey: rawKey,
        hashKey: hashedKey
    }
}

export async function saveAPIKeys(userId: string, hashKey: string, name: string) {

    const api_key = await prisma.api_keys.create({
        data: {
            user_id: userId,
            key_hash: hashKey,
            name: name
        },
        select: {
            id: true,
            user_id: true,
            name: true,
            created_at: true,
            expires_at: true,
            revoked_at: true,
            last_used_at: true
        }
    });

    return api_key;
}