import { UpdateStatusDTO } from "@/application/dtos/admin/updateStatus.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { GetAllProjectsQuery } from "@/application/usecases/admin/interface/projects-usecase.interface";
import { GetAllUsersQuery } from "@/application/usecases/admin/interface/users-usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { UserEntity } from "@/domain/entities/user.entity";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { ADMIN_TYPES } from "@/infrastructure/di/types";
import { errorResponse, successResponse } from "@/shared/utils/response.util";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminController {
    constructor(
        @inject(ADMIN_TYPES.GetAllUsersUseCase) private readonly _getAllUsersUseCase: IExecute<GetAllUsersQuery, { message: string, users: UserEntity[], total: number }>,
        @inject(ADMIN_TYPES.UpdateUserStatusUseCase) private readonly _updateUserStatusUseCase: IExecute<{ userId: string, newStatus: UpdateStatusDTO }, { message: string, newStatus: string }>,
        @inject(ADMIN_TYPES.GetAllProjectsUseCase) private readonly _getAllProjectsUseCase: IExecute<GetAllProjectsQuery, { message: string, projects: ProjectEntity[], total: number }>
    ) { }

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
                "Failed to fetch users",
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
                "Failed to update users",
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
                "Failed to fetch projects",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }
}
