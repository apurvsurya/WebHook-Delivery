import { Router } from "express";
import { createEventController } from "../controllers/events.controller.js";

const router = Router();

router.post("/",createEventController);

export default router;