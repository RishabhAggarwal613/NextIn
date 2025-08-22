// src/routes/auth.routes.js
import { Router } from "express";
import { postLogin, postRegister } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register new user
 * @body { name, email, password }
 */
router.post("/register", postRegister);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user and return JWT
 * @body { email, password }
 */
router.post("/login", postLogin);

export default router;
