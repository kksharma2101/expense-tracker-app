import {
  passwordCompare,
  passwordHash,
} from "../middleware/password.middleware.js";
import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
import JWT from "jsonwebtoken";

// register controllers
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    // check conditions
    if (!(name, email, password)) {
      return next(new AppError("All field is required", 405));
    }

    // email exists
    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
      return next(new AppError("Email is already exists", 405));
    }

    // password bcrypt
    const passwordHashed = await passwordHash(password);

    // create user
    const user = await User.create({
      name,
      email,
      password: passwordHashed,
      role,
    });
    if (!user) {
      return next(new AppError("User is not register, try again", 405));
    }

    await user.save();
    user.password = undefined;

    // generate cookie
    const token = JWT.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    res.status(200).json({
      success: true,
      message: "User register successfully",
      user,
      token,
    });
  } catch (e) {
    return next(new AppError(e.message, 404));
  }
};

// login controllers
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email, password)) {
      return next(new AppError("All data require", 404));
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Email is not match",
      });
    }

    // compare password
    const match = await passwordCompare(password, user.password);
    if (!match) {
      return next(new AppError("Password does not match", 404));
    }

    user.password = undefined;

    // generate jwt token
    const token = JWT.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    res.status(200).json({
      success: true,
      message: "User logged successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (e) {
    return next(new AppError(e.message, 404));
  }
};

// order controller
const getOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Error in order controller",
      error,
    });
  }
};

// get all orders
const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name");
    // .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Error in getAllorder controller",
      error,
    });
  }
};

// update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Error in updateOrderStatus",
      error,
    });
  }
};

export {
  register,
  login,
  //   forgotPasswordController,
  //   userProfileUpdate,
  getOrderController,
  getAllOrderController,
  updateOrderStatus,
};
