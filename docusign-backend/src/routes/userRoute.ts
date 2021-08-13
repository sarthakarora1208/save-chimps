import { Router } from "express";
import {
  deleteUser,
  getUserById,
  getUserByEmail,
  registerUserIfNotRegistered,
} from "../controllers/userController";

const router = Router();

router.route("/get-user-from-email").post(getUserByEmail);
router.route("/register").post(registerUserIfNotRegistered);
router.route("/:id").get(getUserById);
router.route("/").delete(deleteUser);
export = router;
