import { User, USER_ROLE } from "./../entities/User";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "./async";
import ErrorResponse from "../utils/errorResponse";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
export interface IUserAuthInfoRequest extends Request {
  user: User;
  dsAuthCodeGrant: any;
  dsAuth: any;
}
//@desc	          Protect resources
//@route	    MIDDLEWARE

export interface IGetUserAuthInfoRequest extends Request {
  user: User | undefined; // or any other type
}
//@desc	          Protect resources
//@route	    MIDDLEWARE

export const protect = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
      // Set token from cookie
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    const userRepository = getRepository(User);
    try {
      let JWT_SECRET = process.env.JWT_SECRET!;
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userRepository.findOne({
        //@ts-ignore
        where: { id: decoded.id },
      });
      req.user = user;
      next();
    } catch (err: any) {
      return next(new ErrorResponse(err, 401));
    }
  }
);

export const authorize = (role: USER_ROLE) => {
  return (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
    let userRole = req.user && req.user.role;
    if (userRole !== role) {
      return next(
        new ErrorResponse(`User is not authorized to access this route`, 403)
      );
    }
  };
};
