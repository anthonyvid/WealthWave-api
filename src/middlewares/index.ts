import express from "express";
import { merge, get } from "lodash";
import jwt from "jsonwebtoken";
import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["WEALTHWAVE-AUTH"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { _id } = req.body?.user;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(400);
    }
  
    if (currentUserId.toString() !== _id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const verifyToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let { token } = req.body;

    if (!token) {
      const authHeader = req.header("authorization");
      if (authHeader.startsWith("Bearer "))
        token = authHeader.substring(7, authHeader.length);
    }
    // if (!token)
    // next(
    //   throwError(
    //     statusCodes.UNAUTHORIZED,
    //     "Please log in to view this resource."
    //   )
    // );

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      return res.sendStatus(409);
    }

    next();
  } catch (error) {
    next(error);
  }
};
