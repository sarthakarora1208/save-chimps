import {
  createDocument,
  sendDocument,
} from "./../controllers/docusignController";
import { Router } from "express";
const router = Router();

router.route("/send-document").post(sendDocument);
router.route("/create-document").get(createDocument);

export = router;
