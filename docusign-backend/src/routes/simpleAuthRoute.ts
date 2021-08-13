import { Router } from "express";
import { getMe, login, register } from "../controllers/simpleAuthController";
import { protect } from "../middleware/auth";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

export = router;
