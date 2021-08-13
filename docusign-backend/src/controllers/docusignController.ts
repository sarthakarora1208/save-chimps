import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/async";
import { getRepository } from "typeorm";
import ErrorResponse from "../utils/errorResponse";
import { Audit } from "../entities/Audit";
import { User } from "../entities/User";
import path from "path";
const {
  sendEnvelopeForEmbeddedSigning,
} = require("../utils/sendEnvelopeForEmbeddedSigning");
const dsConfig = require("../config/index").config;
const dsReturnUrl = dsConfig.appUrl + "/ds-return";
const dsPingUrl = dsConfig.appUrl + "/"; // Url that will be pinged by the DocuSign signing via Ajax
const docusign = require("docusign-esign");
const fs = require("fs-extra");

//@desc		 	Send Document
//@route		POST /api/v1/docusign/send-document
//@access		Public

export const sendDocument = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auditsRepository = getRepository(Audit);
  }
);
//@desc			Create Document
//@route		POST /api/v1/docusign/create-document
//@access		Public

export const createDocument = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { auditId, userId } = req.query;
    const auditsRepository = getRepository(Audit);
    const userRepository = getRepository(User);

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

    console.log(req.dsAuth.accessToken);
    const args = {
      accessToken:
        "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCA2DJJfV3ZSAgAgED3qoVd2UgCAP_WiEetD4NMqeQiLPvZsOIVAAEAAAAYAAEAAAAFAAAADQAkAAAAYjJkNTllYmMtOWQ4Zi00OWM3LWI1OTMtNjlhNzQ2ZjM1N2U4IgAkAAAAYjJkNTllYmMtOWQ4Zi00OWM3LWI1OTMtNjlhNzQ2ZjM1N2U4EgABAAAABgAAAGp3dF9iciMAJAAAAGIyZDU5ZWJjLTlkOGYtNDljNy1iNTkzLTY5YTc0NmYzNTdlOA.ILZBce4zm5ouwu2l0-xhUch13w5c5gab3j3ChmaNOrzPKejLUJquhNoz2LWXuqQs_EFojAlysd3a0V0DJ0dkwrgyGCMxhRSFr8A0pAT5neKsvrEyNHvwrtK2HO4ADap7JxetoPe-xCWhETwKUfA74WQjHxZ1aIc7OhF--H8UuNHf5ZjPl4lpuD82zLm8E0kZXEEid7SXsG0g7v66EDhTKKxNB1PIEEbzfZ8wULtHXL3qsuN7OAFsFtEgj3XlPEs2yprJdzcxQvigZ-pkU4up9DFvYcgX0BHdfgj5DZz8aWSWJgEQBh2INCrhlyBlKVjmTpguYGom9ZQ1Qgzr2HJEYA",
      basePath: "https://demo.docusign.net/restapi",
      accountId: "1cfad4d0-53d0-4189-b798-748c16c9d741",
      envelopeArgs: envelopeArgs,
    };
    try {
      let results = await sendEnvelopeForEmbeddedSigning(args);
      res.status(200).json({
        success: true,
        url: results.redirectUrl,
        envolopeId: results.envolopeId,
      });
    } catch (err) {
      console.log(err);
    }
  }
);
