import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { userVerify } from "../middleware/auth.middleware.js";

const routes = express.Router();

// register routes
routes.post("/register", register);
// login routes
routes.post("/login", login);

// protected user route auth
routes.get("/user-auth", userVerify, (req, res) => {
  res.status(200).send({ ok: true });
});

export default routes;
