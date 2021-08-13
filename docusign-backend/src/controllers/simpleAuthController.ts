import { getRepository, MoreThan } from "typeorm";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/async";
import ErrorResponse from "../utils/errorResponse";
import { User, USER_ROLE } from "../entities/User";
import * as jwt from "jsonwebtoken";
import { IGetUserAuthInfoRequest } from "../middleware/auth";
const crypto = require("crypto-js");

//const userRepository = getRepository(User);
//@desc         Register user
//@route        POST /api/v1/auth/register
//@access       Public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorResponse("Please add all fields", 400));
    }
    console.log(name, email, password);
    const user = await userRepository.create({
      name,
      email,
      password,
      role: USER_ROLE.STAKHOLDER_ROLE,
    });
    await userRepository.save(user);
    sendTokenResponse(user, 200, res);
  }
);
//@desc         Get current logged in user
//@route        GET /api/v1/auth/me
//@access       Private
export const getMe = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
);
//@desc
//@route		POST /api/v1/
//@access		Public

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }
    let user = await userRepository.findOne({
      where: { email },
      select: ["password", "id"],
    });

    if (!user) {
      return next(new ErrorResponse("Email not found", 401));
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Incorrect password entered", 401));
    }
    user = await userRepository.findOne(user.id);
    res.status(200).json({ success: true, data: user });
    //sendTokenResponse(user, 200, res);
  }
);
//@desc         Log user out/ clear cookie
//@route        GET /api/v1/auth/logout
//@access       Private

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //console.log(req);
    const userRepository = getRepository(User);
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

//@desc         Delete User
//@route        DELETE /api/v1/auth/delete
//@access       Public
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const userRepository = getRepository(User);
    await userRepository.delete({ email: email });
    res.status(200).json({ success: true, data: {} });
  }
);

const sendTokenResponse = (user: User, statusCode: number, res: Response) => {
  // Create token
  //const token = user.getSignedJwtToken();
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE!,
  });

  let cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRE!) || 30;
  const options = {
    // cookie expires in 30 days
    expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  // sending the token as a cookie
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, data: token });
};
