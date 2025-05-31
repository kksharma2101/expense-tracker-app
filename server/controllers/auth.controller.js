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
    const { name, email, password } = req.body;
    // check conditions
    if (!(name, email, password)) {
      return next(new AppError("All field is required", 405));
    }

    // email exists
    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
      return next(new AppError("Email is already exists", 405));
    }

    // password hashed
    const passwordHashed = await passwordHash(password);

    // create user
    const user = await User.create({
      name,
      email,
      password: passwordHashed,
    });
    if (!user) {
      return next(new AppError("User is not register, try again", 405));
    }

    await user.save();
    user.password = undefined;

    // generate token
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
      user,
      token,
    });
  } catch (e) {
    return next(new AppError(e.message, 404));
  }
};

export { register, login };
