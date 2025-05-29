import express from "express";
import {
  login,
  register,
  //   forgotPasswordController,
  //   userProfileUpdate,
  //   getOrderController,
  //   getAllOrderController,
  //   updateOrderStatus,
} from "../controllers/auth.controller.js";
import { isAdmin, userVerify } from "../middleware/auth.middleware.js";

const routes = express.Router();

// register routes
routes.post("/register", register);
// login routes
routes.post("/login", login);
// Forgot password || post

// protected user route auth
routes.get("/user-auth", userVerify, (req, res) => {
  res.status(200).send({ ok: true });
});
// protected admin route auth
routes.get("/admin-auth", userVerify, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// user profile updated

// // order routes
// routes.get("/orders", userVerify, getOrderController);

// // get all orders
// routes.get("/all-orders", userVerify, isAdmin, getAllOrderController);

// // update orider status
// routes.put("/update-status/:orderId", userVerify, isAdmin, updateOrderStatus);

export default routes;
