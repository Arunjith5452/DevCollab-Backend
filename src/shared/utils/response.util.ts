import { Response } from "express";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { SuccessStatus } from "@/domain/enums/status-codes/success-status.enum";

/**
 * Success Response Interface
 */
interface ISuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

/**
 * Standardized Success Response
 */
export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = SuccessStatus.OK
): Response<ISuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error Response Interface
 */
interface IErrorResponse {
  success: false;
  message: string;
  error?: string;
}

/**
 * Standardized Error Response
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = ServerErrorStatus.INTERNAL_SERVER_ERROR,
  error?: unknown
): Response<IErrorResponse> => {
  const errorMessage =
    error instanceof Error ? error.message : String(error || message);

  return res.status(statusCode).json({
    success: false,
    message,
    error: errorMessage,
  });
};
