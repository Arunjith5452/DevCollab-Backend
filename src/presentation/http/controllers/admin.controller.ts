import { UpdateStatusDTO } from "@/application/dtos/admin/updateStatus.dto";
import { MESSAGES } from "@/shared/constants/messages";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { GetAllProjectsQuery } from "@/application/usecases/admin/interface/projects-usecase.interface";
import { GetAllUsersQuery } from "@/application/usecases/admin/interface/users-usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { ADMIN_TYPES } from "@/infrastructure/di/types";
import { errorResponse, successResponse } from "@/shared/utils/response.util";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { ResponseUserDto } from "@/application/dtos/auth/res/response.dto";
import { DashboardStats } from "@/application/dtos/admin/dashboard-stats.dto";
import { ActivityItem } from "@/application/dtos/admin/activity.dto";
import { SubscriptionWithUserDTO } from "@/application/dtos/admin/subscription.dto";

@injectable()
export class AdminController {
    constructor(
        @inject(ADMIN_TYPES.GetAllUsersUseCase) private readonly _getAllUsersUseCase: IExecute<GetAllUsersQuery, { message: string, users: ResponseUserDto[], total: number }>,
        @inject(ADMIN_TYPES.UpdateUserStatusUseCase) private readonly _updateUserStatusUseCase: IExecute<{ userId: string, newStatus: UpdateStatusDTO }, { message: string, newStatus: string }>,
        @inject(ADMIN_TYPES.GetAllProjectsUseCase) private readonly _getAllProjectsUseCase: IExecute<GetAllProjectsQuery, { message: string, projects: ProjectEntity[], total: number }>,
        @inject(ADMIN_TYPES.GetAdminDashboardStatsUseCase) private readonly _getDashboardStatsUseCase: IExecute<{ startDate?: Date, endDate?: Date } | void, { message: string, stats: DashboardStats }>,
        @inject(ADMIN_TYPES.GetAdminActivitiesUseCase) private readonly _getActivitiesUseCase: IExecute<{ page: number, limit: number }, { activities: ActivityItem[], total: number }>,
        @inject(ADMIN_TYPES.GetAllSubscriptionsUseCase) private readonly _getAllSubscriptionsUseCase: IExecute<{ page: number, limit: number, search?: string, status?: string }, { subscriptions: SubscriptionWithUserDTO[], total: number }>
    ) { }

    /**
     * Fetches dashboard statistics.
     * @param req - Express request.
     * @param res - Express response object.
     * @returns JSON with dashboard stats.
     */
    async getDashboardStats(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const query = {
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined
            };

            const result = await this._getDashboardStatsUseCase.execute(query);
            console.log("Stats result", result);
            return successResponse(res, result.message, result.stats);
        } catch (error) {
            return errorResponse(
                res,
                "Failed to fetch dashboard stats",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    /**
     * Fetches paginated recent activities.
     */
    async getActivities(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this._getActivitiesUseCase.execute({ page, limit });
            return successResponse(res, "Activities fetched successfully", result);
        } catch (error) {
            return errorResponse(
                res,
                "Failed to fetch activities",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    /**
     * Fetches all users with optional filters like search, role, and status.
     * @param req - Express request containing query parameters.
     * @param res - Express response object.
     * @returns JSON with paginated user list.
     */
    async GetAllUser(req: Request, res: Response) {
        try {
            const { search, role, status, page, limit } = req.query;

            const query = {
                search: search as string,
                role: role as string,
                status: status as string,
                page: Number(page),
                limit: Number(limit),
            };

            const result = await this._getAllUsersUseCase.execute(query);

            return successResponse(res, result.message, {
                users: result.users,
                total: result.total,
            });
        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.ADMIN.ERROR.FETCH_USERS_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    /**
     * Updates a user’s account status (e.g., active or blocked).
     * @param req - Express request containing user ID and new status.
     * @param res - Express response object.
     * @returns JSON with update confirmation message and new status.
     */
    async UpdateUserStatus(req: Request, res: Response) {
        try {
            const { newStatus } = req.body;
            const userId = req.params.id;
            const result = await this._updateUserStatusUseCase.execute({ userId, newStatus });

            return successResponse(res, '', result)

        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.ADMIN.ERROR.UPDATE_USER_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }


    /**
     * Fetch all projects with optional filters (search, status, difficulty) and pagination.
     * @param req - Express request containing query parameters.
     * @param res - Express response object.
     * @returns JSON with paginated user list.
     */

    async getAllProjects(req: Request, res: Response) {
        try {

            const { search, status, difficulty, page, limit } = req.query

            const query = {
                search: search as string,
                status: status as string,
                difficulty: difficulty as string,
                page: Number(page),
                limit: Number(limit)
            }

            const result = await this._getAllProjectsUseCase.execute(query)

            return successResponse(res, result.message, {
                projects: result.projects,
                total: result.total
            })

        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.ADMIN.ERROR.FETCH_PROJECTS_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    /**
     * Fetches all subscriptions with pagination.
     */
    async getSubscriptions(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const status = req.query.status as string;

            const result = await this._getAllSubscriptionsUseCase.execute({ page, limit, search, status });
            return successResponse(res, "Subscriptions fetched successfully", result);
        } catch (error) {
            return errorResponse(
                res,
                "Failed to fetch subscriptions",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }
}


