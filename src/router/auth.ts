import express from "express";

import {
  login,
  register,
  authenticateRequest,
  logout,
} from "../controllers/auth";
import { isAuthenticated, isOwner, verifyToken } from "../middlewares";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.post(
    "/auth/authenticate-user",
    isAuthenticated,
    isOwner,
    verifyToken,
    authenticateRequest
  );
  router.post("/auth/logout", logout);
};
