import type { Request, Response } from "express";
import { getAllJobsForUser } from "../services/jobs.services.js";

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const jobs = await getAllJobsForUser(userId);

        return res.status(200).json({ jobs });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch delivery jobs"
        });
    }
};