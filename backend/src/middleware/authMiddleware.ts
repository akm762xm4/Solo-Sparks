import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

export interface IAuthRequest extends Request {
  user?: any;
}

const protect = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export { protect };
