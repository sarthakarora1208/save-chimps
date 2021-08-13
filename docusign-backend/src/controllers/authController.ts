import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/async";
import { IUserAuthInfoRequest } from "../middleware/auth";
import ErrorResponse from "../utils/errorResponse";

export const dsLoginCB1 = (req: any, res: Response, next: NextFunction) => {
  req.dsAuthCodeGrant.oauth_callback1(req, res, next);
};
export const dsLoginCB2 = (req: any, res: Response, next: NextFunction) => {
  req.dsAuthCodeGrant.oauth_callback2(req, res, next);
};
//@desc     Login
//@route		GET /ds/login
//@access		Public

export const login = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    console.log("inside login contoller");
    const { auth } = req.query;
    //if (auth === "grand-auth") {
    //}
    let user = req.dsAuth.login(req, res, next);
    console.log(user);
    //res.redirect("/");
  }
);

//@desc
//@route		GET /
//@access		Public

export const mustAuthenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
//@desc
//@route		GET /
//@access		Public

export const returnHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let event = req.query && req.query.event,
      state = req.query && req.query.state,
      envelopeId = req.query && req.query.envelopeId;
    //res.render("pages/ds_return", {
    // title: "Return from DocuSign",
    //event: event,
    //envelopeId: envelopeId,
    //state: state,
    //});
  }
);

//@desc
//@route		GET /
//@access		Public

export const logout = asyncHandler(
  async (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
    //dsConfig.quickstart = "false";
    req.dsAuth.logout(req, res);
  }
);

//@desc
//@route		GET /
//@access		Public

export const logoutCallback = asyncHandler(
  async (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
    req.dsAuth.logoutCallback(req, res);
  }
);
