import { getRevisionRequestsForStakeholder } from "./../controllers/revisionRequestsController";
import {
  createRevisonRequest,
  deleteRevisionRequest,
  getRevisionRequest,
  resolveRevisionRequest,
  updateRevisionRequest,
  addAttachmentToS3,
  addMapImageToS3RevisionRequest,
} from "../controllers/revisionRequestsController";
import { Router } from "express";

const router = Router({ mergeParams: true });
router.route("/").post(createRevisonRequest);

router.route("/add-image").post(addMapImageToS3RevisionRequest);
router.route("/add-attachment").post(addAttachmentToS3);
router.route("/resolve").post(resolveRevisionRequest);
router.route("/:userId/stakeholder").get(getRevisionRequestsForStakeholder);

router
  .route("/:id")
  .get(getRevisionRequest)
  .put(updateRevisionRequest)
  .delete(deleteRevisionRequest);

export = router;
