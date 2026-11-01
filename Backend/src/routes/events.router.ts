import { Router } from "express";
import { createEventController } from "../controllers/events.controller.js";
import { authenticateApiKey } from "../middlewares/authenticateKey.middlewares.js";

const router = Router();

router.post("/create",authenticateApiKey,createEventController);

export default router;