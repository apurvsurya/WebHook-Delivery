import { Router } from "express";
import { getAllJobs } from "../controllers/jobs.controller.js";

const router = Router();

router.get("/getall",getAllJobs);

export default router;