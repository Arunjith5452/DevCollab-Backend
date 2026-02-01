import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance, } from "class-transformer";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { ClientErrorStatus } from "@/domain/enums/status-codes/client-error-status.enum";


/**
 * Middleware for validating incoming request data using DTO classes.
 * 
 * Converts the plain request body into a DTO instance and validates it 
 * using `class-validator` decorators defined in the DTO.
 * 
 *  * @param dtoClass - The DTO class used for validation.
 * @returns An Express middleware function for DTO validation.
 * 
 */

export const validateDTO = (dtoClass: new (...args: any[]) => object) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            const dtoInstance = plainToInstance(dtoClass, req.body, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });

            const errors = await validate(dtoInstance, {
                whitelist: true,
                forbidNonWhitelisted: true,
                validationError: { target: false },
                skipMissingProperties: false
            });

            if (errors.length > 0) {
                const messages = errors
                    .map(err => Object.values(err.constraints || {}).join(", "))
                    .join("; ");

                return res.status(ClientErrorStatus.BAD_REQUEST).json({
                    message: messages,
                });
            }

            req.body = dtoInstance;

            next();
        } catch (error) {
            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(err.message)
        }
    };
};