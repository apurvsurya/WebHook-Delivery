import { Router } from "express";
import { createDestination, getAllDestinations } from "../controllers/destinations.controller.js";
import { authenticate } from "../middlewares/authenticate.middlewares.js";

const router = Router();

router.post('/create', createDestination);
router.get('/getall', authenticate, getAllDestinations);

export default router;