import { Router } from "express";
import { postLogin, postRegister } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/v1/auth/register
router.post("/register", postRegister);

// POST /api/v1/auth/login
router.post("/login", postLogin);

export default router;
