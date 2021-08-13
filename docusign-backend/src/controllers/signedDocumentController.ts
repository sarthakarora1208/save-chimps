import { getRepository } from "typeorm";
import { SignedDocument } from "./../entities/SignedDocument";
import asyncHandler from "../middleware/async";
import ErrorResponse from "../utils/errorResponse";
import { Request, Response, NextFunction } from "express";

//@desc
//@route		POST /api/v1/
//@access		Public

export const getSignedDocuments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const signedDocumentsRepository = getRepository(SignedDocument);
    const signedDocuments = await signedDocumentsRepository.find();
    res.status(200).json({ success: true, data: signedDocuments });
  }
);

//@desc
//@route		GET /api/v1/signed-documents/:auditId/audits
//@access		Public

export const getSignedDocumentsForAudit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const signedDocumentsRepository = getRepository(SignedDocument);
    const id = req.params.auditId;
    const signedDocuments = await signedDocumentsRepository.find({
      where: { audit: { id } },
      relations: ["audit", "user"],
    });
    res.status(200).json({ success: true, data: signedDocuments });
  }
);

//@desc
//@route		GET /api/v1/signed-documents/:userId/user
//@access		Public

export const getSignedDocumentsForUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const signedDocumentsRepository = getRepository(SignedDocument);
    const id = req.params.userId;
    const signedDocuments = await signedDocumentsRepository.find({
      where: { user: { id } },
      relations: ["audit", "user"],
    });
    res.status(200).json({ success: true, data: signedDocuments });
  }
);
//@desc	    Delete Signed document
//@route		POST /api/v1/
//@access		Public

export const deleteSignedDocument = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const signedDocumentsRepository = getRepository(SignedDocument);
    const id = req.params.id;
    let signedDocument = await signedDocumentsRepository.findOne(id);
    if (!signedDocument) {
      return next(new ErrorResponse(`No signed document found!`, 404));
    }
    await signedDocumentsRepository.delete(id);
    res.status(200).json({ sucess: true, data: {} });
  }
);
