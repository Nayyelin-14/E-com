import { NextFunction, Request, Response } from "express";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prevent sending another response if one has already been sent
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};

export default errorHandler;
