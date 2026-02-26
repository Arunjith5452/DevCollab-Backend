import { Request, Response, NextFunction } from "express";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { errorResponse } from "@/shared/utils/response.util";
import { AppError } from "@/shared/utils/app-error";
import { logger } from "@/infrastructure/providers/logs/logger";

const isMongoCastError = (err: unknown): err is { name: string; message: string } => {
  return (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    typeof (err as Record<string, unknown>).name === "string" &&
    (err as Record<string, unknown>).name === "CastError"
  );
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error("this is the errorHandler:", err);

  let error: AppError;

  if (isMongoCastError(err)) {
    error = new AppError("Resource not found", 404);
  }

  else if (err instanceof AppError) {
    error = err;
  }

  else if (err instanceof Error) {
    error = new AppError(err.message || "Internal Server Error", 500);
  }

  else {
    error = new AppError(
      "Internal Server Error",
      ServerErrorStatus.INTERNAL_SERVER_ERROR
    );
  }

  return errorResponse(res, error.message, error.statusCode, error);
};
