import express from "express";
import jwt from "jsonwebtoken";

import { getUserByEmail, createUser } from "../db/users";
import { authentication, comparePasswords, random } from "../utils";

export const authenticateRequest = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    return res.status(200).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("WEALTHWAVE-AUTH", user.authentication.sessionToken, {
      path: "/",
    });

    return res.status(200).json({ user, token }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    if (!email || !password || !firstname || !lastname) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      fname: firstname,
      lname: lastname,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.status(200).json({ user, token }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    res.clearCookie("WEALTHWAVE-AUTH", { path: "/" });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
