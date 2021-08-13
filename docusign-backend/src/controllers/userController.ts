import { getRepository } from "typeorm";
import { Request, Response, NextFunction, json } from "express";
import asyncHandler from "../middleware/async";
import { User } from "../entities/User";
import ErrorResponse from "../utils/errorResponse";

//@desc     Get user by Id
//@route		GET /api/v1/user/:id/
//@access		Public

export const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const id = req.params.id;
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      return next(new ErrorResponse(`No user found `, 404));
    }
    res.status(200).json({ success: true, data: user });
  }
);
//@desc	    Get User By Email
//@route		POST /api/v1/user/get-user-by-email
//@access		Public

export const getUserByEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const { email } = req.body;
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return next(new ErrorResponse(`No user found `, 404));
    }
    res.status(200).json({ success: true, data: user });
  }
);

//@desc
//@route		POST /api/v1/user/register
//@access		Public

export const registerUserIfNotRegistered = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, userId, name } = req.body;
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { email },
    });
    if (!user) {
      let user = await userRepository.create({ name, email, id: userId });
      let newUser = await userRepository.save(user);
      console.log(newUser);
    }
    res.status(200).json({ success: true });
  }
);

//@desc	    Delete user
//@route		DELETE /api/v1/user/
//@access		Public

export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const { email } = req.body;
    const user = await userRepository.findOne({
      where: { email },
    });
    if (!user) {
      return next(new ErrorResponse(`User deleted`, 404));
    }
    await userRepository.delete({ email });
    res.status(200).json({ success: true });
  }
);
