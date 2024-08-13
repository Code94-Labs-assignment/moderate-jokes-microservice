import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../models/errors";
import { JWT_SECRET } from "../configs/config";

export const generateAccessToken = async (email: any) => {
  return jwt.sign(
    {
      email: email,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  );
};

// Validate a token
export const validateToken = async (token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          reject(new UnauthorizedError("Token has expired"));
        } else if (err.name === "JsonWebTokenError") {
          reject(new UnauthorizedError("Invalid Token"));
        } else {
          reject(new UnauthorizedError("Token verification failed"));
        }
      } else {
        resolve();
      }
    });
  });
};
