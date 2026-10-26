import type { NextFunction, Request, Response } from "express";
import type { RegisterDestinationInput } from "../models/destinations.models.js";
import { registerDestination } from "../services/destination.service.js"


export const createDestination = async (req: Request, res: Response, next: NextFunction) => {

    // console.log("Request body:", req.body);
    const url: RegisterDestinationInput = { url: req.body.url };

    if (typeof url.url !== "string" || !url.url.trim()) {
        return res.status(400).json({
            message: "A valid URL is required",
        });
        
    }

    try {
        const result = await registerDestination(url);

        return res.status(201).json({
            message: "Destination registered successfully",
            data: result
        })
    }
    catch (err) {
        return res.status(400).json({
            message:`Error occurred while registering destination: ${(err as Error).message}`,
        })
    }
}
