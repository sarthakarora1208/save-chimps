import {
  getAudits,
  makeDocument,
  signDocument,
} from "./../controllers/auditsController";
import {
  addApprovedAuditor,
  addStakeholdersToAudit,
  createAudit,
  deleteAudit,
  finishAudit,
  getAudit,
  getFinishedAudits,
  getOngoingAudits,
  updateAudit,
} from "../controllers/auditsController";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.route("/").get(getAudits).post(createAudit);
router.route("/:userId/ongoing").get(getOngoingAudits);
router.route("/:userId/finished").get(getFinishedAudits);
router.route("/approve").post(addApprovedAuditor);
router.route("/finish").post(finishAudit, makeDocument);
router.route("/sign-document").post(signDocument);
router.route("/make-document").post(makeDocument);
router.route("/:id").get(getAudit).put(updateAudit).delete(deleteAudit);
router.route("/:id/add-stakeholders").put(addStakeholdersToAudit);

export = router;
