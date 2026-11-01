import type { NextFunction, Request, Response } from "express";
import { generateAPIKeys, saveAPIKeys } from "../services/token.service.js";
import prisma from "../config/prisma.js";


export async function generateAPIKeyForUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            message: "Invalid token or unauthorized user!"
        });
    }

    const name = req.body.name;
    if (!name) {
        return res.status(400).json({
            message: "KEY Description is requied!"
        });
    }



    try {

        const activeKeyCount = await prisma.api_keys.count({
            where: {
                user_id: userId,
                revoked_at: null
            }
        });

        if (activeKeyCount >= 5) {
            return res.status(400).json({
                message: "Maximum active API key limit reached"
            });
        }

        const { rawKey, hashKey } = generateAPIKeys();

        const data = await saveAPIKeys(userId, hashKey, name);


        if (data) {
            return res.status(201).json({
                message: 'API KEY Generated!',
                details: data,
                rawKey: rawKey
            })
        }

    }

    catch (err) {
        return res.status(500).json({
            message: "Unexpected error occured while creating the API KEY"
        })
    }

}