import { CreateProjectDTO } from "@/application/dtos/project/createProject.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { errorResponse, successResponse } from "@/shared/utils/response.util";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";




@injectable()
export class ProjectController {

    constructor(@inject(PROJECT_TYPES.CreateProjectUseCase) private readonly _createProjectUseCase: IExecute<{ userId: string, dto: CreateProjectDTO }, { message: string }>,
        @inject(PROJECT_TYPES.ListProjectUseCase) private readonly _listProjectUseCase: IExecute<GetAllProjectsQuery, any>,
        @inject(PROJECT_TYPES.ProjectDetailsUseCase) private readonly _projectDetailsUseCase: IExecute<string, { project: ProjectEntity[], message: string }>
    ) { }


    /**
    * Creates a new project for a user.
    * @param req - Express request containing project data in the body and user ID in the request object.
    * @param res - Express response object.
    * @returns JSON response with success message upon successful project creation.
    */
    async createProject(req: Request, res: Response) {
        try {

            const userId = req.user?.userId
            const result = await this._createProjectUseCase.execute({ userId, dto: req.body })

            return successResponse(res, result.message)

        } catch (error) {
            console.log(error)
            return errorResponse(res,
                "Project creation failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )

        }
    }


    /**
         * Fetches all projects with optional filters and pagination.
         * @param req - Express request containing query parameters (search, techStack, difficulty, teamSize, page, limit).
         * @param res - Express response object.
         * @returns JSON response containing a list of projects and total count.
         */
    async getAllProjects(req: Request, res: Response) {

        try {

            const { search, techStack, difficulty, teamSize, page, limit } = req.query;

            const query = {
                search: search as string,
                techStack: techStack as string,
                difficulty: difficulty as string,
                teamSize: teamSize as string,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            };

            const result = await this._listProjectUseCase.execute(query)

            return successResponse(res, result.mesage, {
                projects: result.projects,
                total: result.total
            })


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
     * Retrieves detailed information of a specific project.
     * @param req - Express request containing the project ID in parameters.
     * @param res - Express response object.
     * @returns JSON response containing detailed project data.
     */
    async projectDetails(req: Request, res: Response) {
        try {

            const { projectId } = req.params

            const result = await this._projectDetailsUseCase.execute(projectId)

            return successResponse(
                res,
                result.message,
                result.project
            )

        } catch (error) {

            return errorResponse(res,
                "Project details failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )


        }
    }
}