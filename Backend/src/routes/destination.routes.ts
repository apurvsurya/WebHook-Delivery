import { Router } from "express";
import { createDestination } from "../controllers/destinations.controller.js";

const router = Router();

router.post('/',createDestination);

export default router;