import type { NextFunction, Request, Response } from "express";
import type { CreateEventInput } from "../models/events.models.js";
import { createEvent } from "../services/events.service.js";

export async function createEventController(req: Request, res: Response, next: NextFunction): Promise<any> {

    const input: CreateEventInput = req.body;

    if (
        !Number.isInteger(input.destinationId) ||
        Number(input.destinationId) <= 0 ||
        typeof input.eventType !== "string" ||
        input.eventType.trim().length === 0 ||
        input.eventType.length > 200 ||
        input.payload === null ||
        typeof input.payload !== "object" ||
        Array.isArray(input.payload) ||
        input.payload === undefined
    ) {
        return res.status(400).json({
            message:"A valid destinationId, eventType, and JSON object payload are required."
        })
    }
        try {
            const result = await createEvent(input);
            return res.status(201).json({
                message: "Event created successfully",
                event: result
            });
        }
        catch (err) {
            return res.status(400).json({
                message: `Error occurred while registering event: ${(err as Error).message}`,
            })
        }

}