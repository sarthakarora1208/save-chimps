import {
  deleteSignedDocument,
  getSignedDocuments,
  getSignedDocumentsForAudit,
  getSignedDocumentsForUser,
} from "./../controllers/signedDocumentController";
import { Router } from "express";
const router = Router();

router.route("/").get(getSignedDocuments);
router.route("/:id").delete(deleteSignedDocument);
router.route("/:auditId/audits").get(getSignedDocumentsForAudit);
router.route("/:userId/user").get(getSignedDocumentsForUser);

export = router;
