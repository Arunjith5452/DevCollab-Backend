import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { CreatePlanDTO } from "@/application/dtos/plans/create-plan.dto";
import { EditPlanDTO } from "@/application/dtos/plans/edit-plan.dto";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { PlanResponseDTO } from "@/application/dtos/plans/plan-response.dto";
import { successResponse, errorResponse } from "@/shared/utils/response.util";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { MESSAGES } from "@/shared/constants/messages";
import { AppError } from "@/shared/utils/app-error";

@injectable()
export class PlanController {
    constructor(
        @inject(PLAN_TYPES.CreatePlanUseCase) private readonly _createPlanUseCase: IExecute<CreatePlanDTO, PlanResponseDTO>,
        @inject(PLAN_TYPES.EditPlanUseCase) private readonly _editPlanUseCase: IExecute<EditPlanDTO, PlanResponseDTO>,
        @inject(PLAN_TYPES.GetActivePlansUseCase) private readonly _getActivePlansUseCase: IExecute<void, PlanResponseDTO[]>,
        @inject(PLAN_TYPES.GetAllPlansUseCase) private readonly _getAllPlansUseCase: IExecute<void, PlanResponseDTO[]>,
        @inject(PLAN_TYPES.TogglePlanStatusUseCase) private readonly _togglePlanStatusUseCase: IExecute<string, PlanResponseDTO>
    ) { }

    /**
     * Creates a new subscription plan.
     * @param req - Express request object containing plan details in the body.
     * @param res - Express response object.
     * @returns Promise<Response> - The created plan.
     */
    async createPlan(req: Request, res: Response): Promise<Response> {
        try {
            const plan = await this._createPlanUseCase.execute(req.body);
            return successResponse(res, MESSAGES.PLAN.SUCCESS.CREATED, plan);
        } catch (error) {
            const statusCode = error instanceof AppError ? error.statusCode : ServerErrorStatus.INTERNAL_SERVER_ERROR;
            return errorResponse(res, MESSAGES.PLAN.ERROR.CREATION_FAILED, statusCode, error);
        }
    }

    /**
     * Edits an existing subscription plan.
     * @param req - Express request object containing plan ID in params and updates in body.
     * @param res - Express response object.
     * @returns Promise<Response> - The updated plan.
     */
    async editPlan(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const plan = await this._editPlanUseCase.execute({ ...req.body, id });
            return successResponse(res, MESSAGES.PLAN.SUCCESS.UPDATED, plan);
        } catch (error) {
            const statusCode = error instanceof AppError ? error.statusCode : ServerErrorStatus.INTERNAL_SERVER_ERROR;
            return errorResponse(res, MESSAGES.PLAN.ERROR.UPDATE_FAILED, statusCode, error);
        }
    }

    /**
     * Retrieves all active subscription plans.
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns Promise<Response> - List of active plans.
     */
    async getActivePlans(req: Request, res: Response): Promise<Response> {
        try {
            const plans = await this._getActivePlansUseCase.execute();
            return successResponse(res, MESSAGES.PLAN.SUCCESS.FETCHED, plans);
        } catch (error) {
            const statusCode = error instanceof AppError ? error.statusCode : ServerErrorStatus.INTERNAL_SERVER_ERROR;
            return errorResponse(res, MESSAGES.PLAN.ERROR.FETCH_FAILED, statusCode, error);
        }
    }

    /**
     * Retrieves all subscription plans (admin only).
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns Promise<Response> - List of all plans.
     */
    async getAllPlans(req: Request, res: Response): Promise<Response> {
        try {
            const plans = await this._getAllPlansUseCase.execute();
            return successResponse(res, MESSAGES.PLAN.SUCCESS.FETCHED, plans);
        } catch (error) {
            const statusCode = error instanceof AppError ? error.statusCode : ServerErrorStatus.INTERNAL_SERVER_ERROR;
            return errorResponse(res, MESSAGES.PLAN.ERROR.FETCH_FAILED, statusCode, error);
        }
    }

    /**
     * Toggles the active status of a plan.
     * @param req - Express request object containing plan ID in params.
     * @param res - Express response object.
     * @returns Promise<Response> - The updated plan with new status.
     */
    async togglePlanStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const plan = await this._togglePlanStatusUseCase.execute(id);
            return successResponse(res, MESSAGES.PLAN.SUCCESS.UPDATED, plan);
        } catch (error) {
            const statusCode = error instanceof AppError ? error.statusCode : ServerErrorStatus.INTERNAL_SERVER_ERROR;
            return errorResponse(res, MESSAGES.PLAN.ERROR.UPDATE_FAILED, statusCode, error);
        }
    }
}
