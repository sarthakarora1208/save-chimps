import {
  dsLoginCB1,
  dsLoginCB2,
  login,
  logout,
  logoutCallback,
  mustAuthenticate,
  returnHandler,
} from "./../controllers/authController";
import { Router } from "express";

const router = Router();

router.route("/login").get(login);
router.route("/callback").get([dsLoginCB1, dsLoginCB2]);
router.route("/logout").get(logout);
router.route("/logoutCallback").get(logoutCallback);
router.route("/mustAuthenticate").get(mustAuthenticate);
router.route("/ds-return").get(returnHandler);

export = router;
