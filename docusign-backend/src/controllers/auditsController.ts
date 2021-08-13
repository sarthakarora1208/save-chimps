import { SignedDocument } from "./../entities/SignedDocument";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { downloadImagesForAudit } from "./../utils/downloadImagesForAudit";
import { downloadImagesForRevisionRequests } from "./../utils/downloadImagesForRevisionRequests";
import {
  BLACK,
  BLUE,
  BUCKET_NAME,
  GOTHAM,
  GREY,
  OXYGEN_BOLD,
  WHITE,
} from "./../constants/misc";
import {
  RevisionRequest,
  REVISION_REQUEST_STATE,
} from "./../entities/RevisionRequest";
import { Request, Response, NextFunction } from "express";
import { getRepository, Not, SimpleConsoleLogger } from "typeorm";
import asyncHandler from "../middleware/async";
import ErrorResponse from "../utils/errorResponse";
import { AUDIT_STATE } from "../entities/Audit";
import { Audit } from "../entities/Audit";
import { User, USER_ROLE } from "../entities/User";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { OXYGEN } from "../constants/misc";
import { s3bucket } from "../server";
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const {
  sendEnvelopeForEmbeddedSigning,
} = require("../utils/sendEnvelopeForEmbeddedSigning");
const dsConfig = require("../config/index").config;
const dsReturnUrl = "http://localhost:3000/stakeholder/finished-signing";
const dsPingUrl = dsConfig.appUrl + "/"; // Url that will be pinged by the DocuSign signing via Ajax
const docusign = require("docusign-esign");

//@desc 		Get Audits
//@route		GET /api/v1/audits
//@access		Public

export const getAudits = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const audits = await auditsRepository.find();
    res.status(200).json({ success: true, data: audits });
  }
);

//@desc 		Get Audit
//@route		GET /api/v1/audits/:id
//@access		Public

export const getAudit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const id = req.params.id;
    const audit = await auditsRepository.findOne({
      where: { id },
      relations: [
        "auditors",
        "approvedAuditors",
        "startedBy",
        "revisionRequests",
      ],
    });
    if (!audit) {
      return next(new ErrorResponse(`No audit found with ${id}`, 404));
    }
    res.status(200).json({ success: true, data: audit });
  }
);

//@desc			Get Audits for Stakeholders & ArcGIS user
//@route		GET /api/v1/audits/:userId/ongoing
//@access		Public

export const getOngoingAudits = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const userRepository = getRepository(User);

    const userId = req.params.userId;

    const user = await userRepository.findOne({
      where: { id: userId },
    });
    console.log(user);

    if (!user) {
      return next(new ErrorResponse(`No user found with id of ${userId}`, 404));
    }

    let audits: Audit[] = [];
    let newAudits: Audit[] = [];

    let isArcGISUser = user.role === USER_ROLE.ARCGIS_USER_ROLE ? true : false;

    if (isArcGISUser) {
      //const id = req.params.arcgi
      audits = await auditsRepository.find({
        where: [
          { startedBy: { id: userId }, state: AUDIT_STATE.STARTED },
          { startedBy: { id: userId }, state: AUDIT_STATE.UNDER_REVIEW },
        ],

        relations: [
          "startedBy",
          "auditors",
          "approvedAuditors",
          "revisionRequests",
        ],
      });
    } else {
      audits = await auditsRepository
        .createQueryBuilder("audit")
        .leftJoinAndSelect("audit.startedBy", "startedBy")
        .leftJoinAndSelect("audit.revisionRequests", "revisionRequests")
        .leftJoinAndSelect("audit.approvedAuditors", "approvedAuditors")
        .leftJoin("audit.auditors", "auditor")
        .where("auditor.id = :id ", { id: userId })
        .where("audit.state != :state", { state: AUDIT_STATE.FINISHED })
        .getMany();
    }
    res.status(200).json({
      success: true,
      data: audits,
    });
  }
);

//@desc			Get Finished Audits for Stakeholders & ArcGIS user
//@route		GET /api/v1/audits/:userId/finished
//@access		Public

export const getFinishedAudits = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const userRepository = getRepository(User);

    let userId = req.params.userId;
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return next(new ErrorResponse(`No user found with id of ${userId}`, 404));
    }
    let audits: Audit[] = [];

    let isArcGISUser = user.role === USER_ROLE.ARCGIS_USER_ROLE ? true : false;

    if (isArcGISUser) {
      //const id = req.params.arcgi
      audits = await auditsRepository.find({
        where: { startedBy: { id: userId }, state: AUDIT_STATE.FINISHED },
        relations: [
          "startedBy",
          "auditors",
          "approvedAuditors",
          "revisionRequests",
        ],
      });
    } else {
      audits = await auditsRepository
        .createQueryBuilder("audit")
        .leftJoinAndSelect("audit.startedBy", "startedBy")
        .leftJoinAndSelect("audit.revisionRequests", "revisionRequests")
        .leftJoinAndSelect("audit.approvedAuditors", "approvedAuditors")
        .leftJoin("audit.auditors", "auditor")
        .where("auditor.id = :id ", { id: userId })
        .where("audit.state = :state", { state: AUDIT_STATE.FINISHED })
        .getMany();
    }
    res.status(200).json({
      success: true,
      data: audits,
    });
  }
);

//@desc			Create Audit
//@route		GET /api/v1/audits
//@access		Public
export const createAudit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const userRepository = getRepository(User);
    let { name, userId }: { name: string; userId: string } = req.body;

    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return next(new ErrorResponse(`No user found with id of ${userId}`, 404));
    }
    let audit = await auditsRepository.create({
      name,
      state: AUDIT_STATE.STARTED,
      startedBy: user,
    });
    let newAudit = await auditsRepository.save(audit);
    res.status(201).json({
      success: true,
      data: newAudit,
    });
  }
);

//@desc			Update Audit
//@route		POST /api/v1/audits/:id
//@access		Public

export const updateAudit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const id = req.params.id;
    let audit = await auditsRepository.findOne(id);
    if (!audit) {
      return next(new ErrorResponse(`No audit found with id of ${id}`, 404));
    }
    let updationObject = {};
    if (req.body.finalMapUrl) {
      updationObject = { ...req.body.finalMapUrl };
    }
    if (req.body.finalFileUrl) {
      updationObject = { ...req.body.finalMapUrl };
    }
    auditsRepository.merge(audit, updationObject);

    const updatedAudit = await auditsRepository.save(audit);
    res.status(200).json({
      success: true,
      data: updatedAudit,
    });
  }
);

//@desc			Delete Audit
//@route		DELETE /api/v1/audits/:id
//@access		Public

export const deleteAudit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const id = req.params.id;
    let audit = await auditsRepository.findOne(id);
    if (!audit) {
      return next(new ErrorResponse(`No audit found with id of ${id}`, 404));
    }

    await auditsRepository.delete(id);
    res.status(200).json({ sucess: true, data: {} });
  }
);

//@desc     Add Stakeholders to audit
//@route		PUT /api/v1/audits/:id/add-stakeholders
//@access		Public

export const addStakeholdersToAudit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const userRepository = getRepository(User);
    const id = req.params.id;
    let audit = await auditsRepository.findOne(id);
    if (!audit) {
      return next(new ErrorResponse(`No audit found with id of ${id}`, 404));
    }
    console.log(req.body);

    const userIds: string[] = req.body.userIds;
    const auditors: User[] = [];

    let i = 0;
    let userId;
    for (i = 0; i < userIds.length; i++) {
      userId = userIds[i];
      console.log(userId);
      const user = await userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        return next(
          new ErrorResponse(`No user found with id of ${userId}`, 404)
        );
      } else {
        auditors.push(user);
      }
    }
    audit.auditors = auditors;
    const updatedAudit = await auditsRepository.save(audit);
    res.status(200).json({
      success: true,
      data: updatedAudit,
    });
  }
);

//@desc	    Added approved-auditor
//@route		POST /api/v1/audits/approve
//@access		Public

export const addApprovedAuditor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const userRepository = getRepository(User);

    const id = req.body.auditId;
    const userId = req.body.userId;

    let audit = await auditsRepository.findOne({
      where: { id },
      relations: ["approvedAuditors"],
    });
    if (!audit) {
      return next(new ErrorResponse(`No audit found with id of ${id}`, 404));
    }
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    let updationObject = {};
    if (!user) {
      return next(new ErrorResponse(`No user found with id of ${userId}`, 404));
    } else {
      updationObject = {
        ...updationObject,
        approvedAuditors: [...audit.approvedAuditors, user],
        approvedBy: audit.approvedBy + 1,
      };
    }
    auditsRepository.merge(audit, updationObject);

    const updatedAudit = await auditsRepository.save(audit);

    res.status(200).json({
      success: true,
      data: updatedAudit,
    });
  }
);

//@desc
//@route		POST /api/v1/audits/sign-document
//@access		Public

export const signDocument = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { auditId, userId, accessToken } = req.body;
    const auditsRepository = getRepository(Audit);
    const userRepository = getRepository(User);
    const signedDocumentRepository = getRepository(SignedDocument);

    const audit = await auditsRepository.findOne({
      where: { id: auditId },
      relations: [
        "auditors",
        "approvedAuditors",
        "startedBy",
        "revisionRequests",
      ],
    });

    if (!audit) {
      return next(new ErrorResponse(`No audit found with ${auditId}`, 404));
    }
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return next(new ErrorResponse(`No user found with id of ${userId}`, 404));
    }

    const envelopeArgs = {
      signerEmail: user.email,
      signerName: user.name,
      signerClientId: user.id,
      dsReturnUrl: dsReturnUrl,
      dsPingUrl: dsPingUrl,
      docFile: path.resolve(
        __dirname,
        "..",
        "public",
        "uploads",
        `${audit.id}.pdf`
      ),
    };

    const args = {
      accessToken: accessToken,
      basePath: "https://demo.docusign.net/restapi",
      accountId: "1cfad4d0-53d0-4189-b798-748c16c9d741",
      envelopeArgs: envelopeArgs,
    };
    try {
      let results = await sendEnvelopeForEmbeddedSigning(args);
      console.log(results.envelopeId);
      let signedDocument = await signedDocumentRepository.create({
        envelopeId: results.envelopeId,
        audit,
        user,
      });
      const newSignedDocument = await signedDocumentRepository.save(
        signedDocument
      );
      console.log(newSignedDocument);

      res.status(200).json({
        success: true,
        data: {
          url: results.redirectUrl,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
);

//@desc	    Finish Audit
//@route		POST /api/v1/audits/:id/finish
//@access		Public

export const finishAudit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const id = req.body.id;
    const finalMapUrl = req.body.finalMapUrl;

    let audit = await auditsRepository.findOne({
      where: { id },
    });
    if (!audit) {
      return next(new ErrorResponse(`No audit found with id of ${id}`, 404));
    }
    let updationObject = {
      state: AUDIT_STATE.FINISHED,
      finalMapUrl,
    };

    auditsRepository.merge(audit, updationObject);
    const updatedAudit = await auditsRepository.save(audit);
    next();
  }
);
//@desc		  make-final-document
//@route		POST /api/v1/audits/final-document
//@access		Public

export const makeDocument = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
    const revisionRequestRepository = getRepository(RevisionRequest);

    const id = req.body.id;
    const audit = await auditsRepository.findOne({
      where: { id },
      relations: [
        "auditors",
        "approvedAuditors",
        "startedBy",
        "revisionRequests",
      ],
    })!;
    let revisionRequests = await revisionRequestRepository.find({
      where: { audit: { id }, state: REVISION_REQUEST_STATE.RESOLVED },
      relations: ["audit", "requestedBy"],
    });
    console.log(revisionRequests.length);
    await downloadImagesForRevisionRequests(revisionRequests);
    await downloadImagesForAudit(audit!);

    const doc = new PDFDocument();
    let FILE_PATH = path.resolve(
      __dirname,
      "..",
      "public",
      "uploads",
      `${id}.pdf`
    );
    doc.pipe(fs.createWriteStream(FILE_PATH));
    const OxygenFontData = fs.readFileSync(
      path.resolve(__dirname, "..", "assets", "font", `${OXYGEN}.ttf`)
    );
    const OxygenBoldFontData = fs.readFileSync(
      path.resolve(__dirname, "..", "assets", "font", `${OXYGEN_BOLD}.ttf`)
    );
    const GothamFontData = fs.readFileSync(
      path.resolve(__dirname, "..", "assets", "font", `${GOTHAM}.ttf`)
    );
    doc.registerFont(OXYGEN, OxygenFontData);
    doc.registerFont(OXYGEN_BOLD, OxygenBoldFontData);
    doc.registerFont(GOTHAM, GothamFontData);
    doc
      .moveUp(0)
      .image(
        path.resolve(
          __dirname,
          "..",
          "assets",
          "images",
          "jane-godall-logo.png"
        ),
        10,
        0,
        {
          fit: [100, 75],
          valign: "center",
        }
      );

    doc
      .moveUp(0)
      .image(
        path.resolve(__dirname, "..", "assets", "images", "logo.png"),
        500,
        0,
        {
          fit: [100, 75],
          valign: "center",
        }
      );
    doc
      .strokeColor("#000")
      .lineWidth(2)
      .moveTo(10, 60)
      .lineTo(600, 60)
      .stroke()
      .moveDown();
    doc
      .font(GOTHAM)
      .fontSize(18)
      .text(`AUDIT REPORT`, {
        underline: true,
        align: "center",
      })
      .moveDown();
    doc
      .font(GOTHAM)
      .fontSize(14)
      .text(`Signer Details`, {
        underline: true,
      })
      .moveDown();
    doc
      .font(OXYGEN)
      .fontSize(10)
      .fillColor(BLACK)
      .text(`Auditor Name:`, { continued: true })
      .fillColor(WHITE)
      .text("/fullname/")
      .moveDown(1)
      .fillColor(BLACK)
      .text(`Auditor Email:`, { continued: true })
      .fillColor(WHITE)
      .text("/email/")
      .moveDown(2);

    doc
      .fillColor(BLACK)
      .font(GOTHAM)
      .fontSize(14)
      .text(`Audit Details`, {
        underline: true,
      })
      .moveDown();

    doc
      .font(OXYGEN)
      .fontSize(10)
      .fillColor(BLACK)
      .text(`Audit Name`, { continued: true })
      .fillColor(GREY)
      .text(`${audit!.name}`, { align: "right" })
      .fillColor(BLACK)
      .text(`Start Date`, {
        continued: true,
      })
      .fillColor(GREY)
      .text(
        `${new Date(audit!.createdAt).toLocaleString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        {
          align: "right",
        }
      )
      .fillColor(BLACK)
      .text("Auditors", { continued: true })
      .fillColor(GREY)
      .text(`${audit!.auditors.length}`, { align: "right" })
      .fillColor(BLACK)
      .text("Revisions", { continued: true })
      .fillColor(GREY)
      .text(`${audit!.revisionRequests.length}`, { align: "right" })
      .fillColor(BLACK)
      .text("Final Map URL", { continued: true })
      .fillColor("#0000FF")
      .text(`${audit!.finalMapUrl}`, {
        link: `${audit!.finalMapUrl}`,
        align: "right",
        underline: true,
      })
      .moveDown(2);

    doc
      .fillColor(BLACK)
      .font(GOTHAM)
      .fontSize(14)
      .text(`GIS User Details `, {
        underline: true,
      })
      .moveDown();

    doc
      .font(OXYGEN)
      .fontSize(10)
      .fillColor(BLACK)
      .text(`Name`, { continued: true })
      .fillColor(GREY)
      .text(`${audit!.startedBy.name}`, { align: "right" })
      .fillColor(BLACK)
      .text(`Email`, { continued: true })
      .fillColor(BLUE)
      .text(`${audit!.startedBy.email}`, {
        link: `mailto:${audit!.startedBy.email}`,
        align: "right",
      })
      .moveDown(2);

    doc
      .fillColor(BLACK)
      .font(GOTHAM)
      .fontSize(14)
      .text(`Auditor Details`, {
        underline: true,
      })
      .moveDown();
    doc
      .font(OXYGEN_BOLD)
      .fontSize(12)
      .fillColor(BLACK)
      .text(`S.No`, { continued: true, align: "left", underline: false })
      .text(`Name`, { continued: true, align: "center", underline: false })
      .text(`Email`, { align: "right", underline: false })
      .moveDown();

    doc
      .strokeColor("#000")
      .lineWidth(1)
      .moveTo(70, doc.y - 15)
      .lineTo(550, doc.y - 15)
      .stroke();

    let i = 0;
    for (i = 0; i < audit!.auditors.length; i++) {
      let { name, email } = audit!.auditors[i];
      doc
        .font(OXYGEN)
        .fontSize(10)
        .fillColor(GREY)
        .text(`${i + 1}`, { continued: true, align: "left" })
        .fillColor(GREY)
        .text(name, { continued: true, align: "center" })
        .fillColor(BLUE)
        .text(`${email}`, {
          link: `mailto:${audit!.startedBy.email}`,
          align: "right",
        })
        .moveDown();
    }
    for (i = 0; i < revisionRequests.length; i++) {
      let revisionRequest = revisionRequests[0];

      doc.addPage();
      doc
        .moveUp(0)
        .image(
          path.resolve(
            __dirname,
            "..",
            "assets",
            "images",
            "jane-godall-logo.png"
          ),
          10,
          0,
          {
            fit: [100, 75],
            valign: "center",
          }
        );

      doc
        .moveUp(0)
        .image(
          path.resolve(__dirname, "..", "assets", "images", "logo.png"),
          500,
          0,
          {
            fit: [100, 75],
            valign: "center",
          }
        );
      doc
        .strokeColor("#000")
        .lineWidth(2)
        .moveTo(10, 60)
        .lineTo(600, 60)
        .stroke()
        .moveDown();
      doc
        .font(GOTHAM)
        .fontSize(14)
        .text(`Revision #${i + 1}`, {
          align: "center",
        })
        .moveDown(2);
      let key = revisionRequests[i].editedMapURL.replace(
        "https://bucket-1234.s3.amazonaws.com/",
        ""
      );

      doc
        .fillColor(BLACK)
        .font(GOTHAM)
        .fontSize(14)
        .text(`Details `, {
          underline: true,
        })
        .moveDown();

      doc
        .font(OXYGEN)
        .fontSize(10)
        .fillColor(BLACK)
        .text(`Comments`)
        .fillColor(GREY)
        .text(`${revisionRequest.comments}`)
        .fillColor(BLACK)
        .text(`Requested by`, { continued: true })
        .fillColor(GREY)
        .text(`${revisionRequest.requestedBy.name}`, { align: "right" })
        .fillColor(BLACK)
        .text(`Email`, { continued: true })
        .fillColor(BLUE)
        .text(`${revisionRequest.requestedBy.email}`, {
          link: `mailto:${revisionRequest.requestedBy.email}`,
          align: "right",
        })
        .fillColor(BLACK)
        .text(`Requested At`, {
          continued: true,
        })
        .fillColor(GREY)
        .text(
          `${new Date(revisionRequest.createdAt).toLocaleString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
          {
            align: "right",
          }
        )
        .fillColor(BLACK)
        .text(`Resolved At`, {
          continued: true,
        })
        .fillColor(GREY)
        .text(
          `${new Date(revisionRequest.updatedAt).toLocaleString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
          {
            align: "right",
          }
        )
        .fillColor(BLACK)
        .text("Sketch Map URL", { continued: true })
        .fillColor(BLUE)
        .text(`${revisionRequest.editedMapURL}`, {
          link: `${revisionRequest.editedMapURL}`,
          align: "right",
          underline: true,
        })
        .moveDown(2);
      doc
        .image(
          path.resolve(__dirname, "..", "public", "uploads", `${key}.jpg`),
          {
            fit: [400, 400],
            align: "center",
          }
        )
        .moveDown(2);
    }
    doc.addPage();
    doc
      .moveUp(0)
      .image(
        path.resolve(
          __dirname,
          "..",
          "assets",
          "images",
          "jane-godall-logo.png"
        ),
        10,
        0,
        {
          fit: [100, 75],
          valign: "center",
        }
      );

    doc
      .moveUp(0)
      .image(
        path.resolve(__dirname, "..", "assets", "images", "logo.png"),
        500,
        0,
        {
          fit: [100, 75],
          valign: "center",
        }
      );
    doc
      .strokeColor("#000")
      .lineWidth(2)
      .moveTo(10, 60)
      .lineTo(600, 60)
      .stroke()
      .moveDown();

    let key = audit!.finalMapUrl.replace(
      "https://bucket-1234.s3.amazonaws.com/",
      ""
    );
    doc
      .fillColor(BLACK)
      .font(GOTHAM)
      .fontSize(14)
      .text(`Final Map`, {
        underline: true,
        align: "center",
      })
      .moveDown(2);
    doc
      .image(path.resolve(__dirname, "..", "public", "uploads", `${key}.jpg`), {
        fit: [400, 400],
        align: "center",
      })
      .moveDown(2);
    doc
      .fillColor(BLACK)
      .font(GOTHAM)
      .fontSize(14)
      .text(`Declaration`, {
        underline: true,
        align: "center",
      })
      .moveDown();

    doc
      .font(OXYGEN)
      .fontSize(10)
      .fillColor(BLACK)
      .text(
        `I hereby confirm that, I have reviewed the above changes in the Eastern Chimpanzee Range map. I am satisfied with the current version of the map edited by ${
          audit!.startedBy.name
        }(${audit!.startedBy.email})`,
        {
          align: "left",
        }
      )
      .moveDown();

    doc
      .fillColor(BLACK)
      .text("Signature", doc.page.width - 150, doc.page.height - 50, {
        continued: true,
        lineBreak: false,
      });
    doc
      .fillColor(WHITE)
      .text("/sn1/", doc.page.width - 100, doc.page.height - 50, {
        lineBreak: false,
      });

    doc.end();
    await sleep(3000);

    let fileContent = fs.readFileSync(FILE_PATH);
    let params: PutObjectRequest = {
      Bucket: BUCKET_NAME,
      Key: `${id}.pdf`,
      Body: fileContent,
      ContentType: "application/pdf",
    };

    let { Location, Key } = await s3bucket.upload(params).promise();
    console.log(Location);
    auditsRepository.merge(audit!, { finalFileUrl: Location });
    const updatedAudit = await auditsRepository.save(audit!);
    console.log(updatedAudit);
    res.status(200).json({ success: true, data: updatedAudit });
  }
);
