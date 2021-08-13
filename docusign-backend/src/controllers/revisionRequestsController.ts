import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { Audit, AUDIT_STATE } from "../entities/Audit";
import { User } from "../entities/User";
import asyncHandler from "../middleware/async";
import ErrorResponse from "../utils/errorResponse";
import { s3bucket } from "../server";
import {
  RevisionRequest,
  REVISION_REQUEST_STATE,
} from "../entities/RevisionRequest";
import { BUCKET_NAME } from "../constants/misc";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from "uuid";

//@desc			Get Revision Request
//@route		GET /api/v1/revision-requests/:id
//@access		Public

export const getRevisionRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const revisionRequestRepository = getRepository(RevisionRequest);
    const id = req.params.id;
    const revisionRequest = await revisionRequestRepository.findOne({
      where: { id },
      relations: ["audit", "requestedBy"],
    });
    if (!revisionRequest) {
      return next(
        new ErrorResponse(`No revision request found with ${id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: revisionRequest });
  }
);

//@desc     Get revision request for stakeholder
//@route		GET /api/v1/revision-requests/:userId/stakeholder
//@access		Public

export const getRevisionRequestsForStakeholder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const revisionRequestRepository = getRepository(RevisionRequest);
    let revisionRequests: RevisionRequest[] = [];

    const id = req.params.userId;
    revisionRequests = await revisionRequestRepository.find({
      where: { requestedBy: { id }, state: REVISION_REQUEST_STATE.OPEN },
      relations: ["audit", "requestedBy"],
    });
    res.status(200).json({
      success: true,
      data: revisionRequests,
    });
  }
);

//@desc     Create revision request
//@route		POST /api/v1/revision-requests
//@access		Public

export const createRevisonRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const revisionRequestRepository = getRepository(RevisionRequest);
    const userRepository = getRepository(User);
    const auditsRepository = getRepository(Audit);

    let { comments, attachment, userId, auditId, editedMapURL } = req.body;

    let audit = await auditsRepository.findOne(auditId);
    if (!audit) {
      return next(
        new ErrorResponse(`No audit found with id of ${auditId}`, 404)
      );
    }

    let updateAuditObject = {
      state: AUDIT_STATE.UNDER_REVIEW,
    };

    auditsRepository.merge(audit, updateAuditObject);

    const updatedAudit = await auditsRepository.save(audit);

    console.log(updatedAudit);

    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return next(new ErrorResponse(`No user found with id of ${userId}`, 404));
    }
    let revisionRequest = await revisionRequestRepository.create({
      comments,
      attachment,
      audit,
      editedMapURL,
      requestedBy: user,
      state: REVISION_REQUEST_STATE.OPEN,
    });
    let newRevisionRequest = await revisionRequestRepository.save(
      revisionRequest
    );
    res.status(201).json({
      success: true,
      data: newRevisionRequest,
    });
  }
);

//@desc	    Update Revision Request
//@route		UPDATE /api/v1/revision-requests
//@access		Public

export const updateRevisionRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const revisionRequestRepository = getRepository(RevisionRequest);
    const id = req.params.id;
    let revisionRequest = await revisionRequestRepository.findOne(id);
    if (!revisionRequest) {
      return next(
        new ErrorResponse(`No Revision Request found with ${id}`, 404)
      );
    }
    let updationObject = {};

    if (req.body.comments) {
      updationObject = { ...req.body.comments };
    }
    if (req.body.attachment) {
      updationObject = { ...req.body.attachment };
    }
    if (req.body.editedMapURL) {
      updationObject = { ...req.body.editedMapURL };
    }

    revisionRequestRepository.merge(revisionRequest, updationObject);

    const updatedRevisionRequest = await revisionRequestRepository.save(
      revisionRequest
    );
    res.status(200).json({
      success: true,
      data: updatedRevisionRequest,
    });
  }
);

//@desc     Delete Revision Request
//@route		DELETE /api/v1/revision-requests/:id
//@access		Public

export const deleteRevisionRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const revisionRequestRepository = getRepository(RevisionRequest);
    const id = req.params.id;
    let revisionRequest = await revisionRequestRepository.findOne(id);
    if (!revisionRequest) {
      return next(
        new ErrorResponse(
          `No revision request object found with id of ${id}`,
          404
        )
      );
    }
    await revisionRequestRepository.delete(id);
    res.status(200).json({ success: true, data: {} });
  }
);

//@desc	    Resolve Revision Request
//@route		PUT /api/v1/revision-requests/:id/resolve
//@access		Public

export const resolveRevisionRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const revisionRequestRepository = getRepository(RevisionRequest);
    const auditsRepository = getRepository(Audit);

    const { revisionRequestId, auditId } = req.body;
    let revisionRequest = await revisionRequestRepository.findOne({
      where: { id: revisionRequestId },
      relations: ["audit", "requestedBy"],
    });
    if (!revisionRequest) {
      return next(
        new ErrorResponse(
          `No Revision Request found with ${revisionRequestId}`,
          404
        )
      );
    }

    let audit = await auditsRepository.findOne(auditId);

    if (!audit) {
      return next(
        new ErrorResponse(`No audit found with id of ${auditId}`, 404)
      );
    }

    let updateAuditObject = {
      state: AUDIT_STATE.STARTED,
    };
    auditsRepository.merge(audit, updateAuditObject);

    const updatedAudit = await auditsRepository.save(audit);

    console.log(updatedAudit);

    let updationObject = {
      state: REVISION_REQUEST_STATE.RESOLVED,
    };

    revisionRequestRepository.merge(revisionRequest, updationObject);

    const updatedRevisionRequest = await revisionRequestRepository.save(
      revisionRequest
    );
    console.log(updatedRevisionRequest);
    //update pdf
    res.status(200).json({
      success: true,
      data: updatedRevisionRequest,
    });
  }
);

//@desc		  Add Map Image to S3
//@route		PUT /api/v1/revision-requests/add-image
//@access		Public

export const addMapImageToS3RevisionRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const revisionRequestRepository = getRepository(RevisionRequest);
    //let revisionRequest = await revisionRequestRepository.findOne(id);
    const { imageBinary } = req.body;
    let buf = Buffer.from(
      imageBinary.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    let params: PutObjectRequest = {
      Bucket: BUCKET_NAME,
      Key: uuidv4(),
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };

    let { Location, Key } = await s3bucket.upload(params).promise();
    console.log(Location);
    // let updationObject = {
    //   editedMapURL: Location,
    // };

    // //console.log(data.);
    // if (!revisionRequest) {
    //   return next(
    //     new ErrorResponse(`No Revision Request found with ${id}`, 404)
    //   );
    // }

    // revisionRequestRepository.merge(revisionRequest, updationObject);

    // const updatedRevisionRequest = await revisionRequestRepository.save(
    //   revisionRequest
    // );
    res.status(201).json({
      success: true,
      data: Location,
    });
  }
);
//@desc     Add attachment to S3
//@route		POST /api/v1/revision-requests/add-attachment
//@access		Public

export const addAttachmentToS3 = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { imageBinary } = req.body;
    console.log(imageBinary);
    let buf = Buffer.from(
      imageBinary.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    let params: PutObjectRequest = {
      Bucket: BUCKET_NAME,
      Key: uuidv4(),
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };

    //let buf = Buffer.from(await file.arrayBuffer());

    let { Location } = await s3bucket.upload(params).promise();
    res.status(201).json({
      success: true,
      data: Location,
    });
  }
);
