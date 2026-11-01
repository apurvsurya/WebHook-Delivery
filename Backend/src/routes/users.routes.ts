import { Router } from "express";
import { CreateUser, Login } from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/authenticate.middlewares.js";
import { generateAPIKeyForUser } from "../controllers/api_key.controller.js";

const router = Router();

router.post("/register",CreateUser);
router.post("/login",Login);
router.post("/generatekey",authenticate,generateAPIKeyForUser)

export default router;