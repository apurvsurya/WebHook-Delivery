import { Router } from "express";
import { createEventController, getAllEventsController } from "../controllers/events.controller.js";
import { authenticateApiKey } from "../middlewares/authenticateKey.middlewares.js";
import { authenticate } from "../middlewares/authenticate.middlewares.js";

const router = Router();

router.post("/create",authenticateApiKey,createEventController);
router.get("/getall",authenticate,getAllEventsController);

export default router;