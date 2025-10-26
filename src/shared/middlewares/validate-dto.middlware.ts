import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance, } from "class-transformer";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { ClientErrorStatus } from "@/domain/enums/status-codes/client-error-status.enum";

export const validateDTO = (dtoClass: any) => {
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
                const formattedErrors: Record<string, string> = {};
                errors.forEach(err => {
                    formattedErrors[err.property] = Object.values(err.constraints || {}).join(", ");
                });

                return res.status(ClientErrorStatus.BAD_REQUEST).json(formattedErrors);
            }

            req.body = dtoInstance;

            next();
        } catch (error: any) {
            res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(error);
        }
    };
};