import { ApplyToProjectDTO } from "@/application/dtos/project/apply-project.dto";
import { ApproveApplicationDTO } from "@/application/dtos/project/approve-application.dto";
import { CreateProjectDTO } from "@/application/dtos/project/createProject.dto";
import { UpdateProjectDTO } from "@/application/dtos/project/edit-project.dto";
import { RejectApplicationDTO } from "@/application/dtos/project/reject-application.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { GetAllProjectsQuery } from "@/application/usecases/project/interface/project-listing.usecase.interface";
import { GetProjectMembersQuery } from "@/application/usecases/project/interface/team-members-listing.usecase.interface";
import { ApplicationEntity } from "@/domain/entities/application.entity";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { errorResponse, successResponse } from "@/shared/utils/response.util";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";




@injectable()
export class ProjectController {

    constructor(
        @inject(PROJECT_TYPES.CreateProjectUseCase) private readonly _createProjectUseCase: IExecute<{ userId: string, dto: CreateProjectDTO }, { message: string }>,
        @inject(PROJECT_TYPES.ListProjectUseCase) private readonly _listProjectUseCase: IExecute<GetAllProjectsQuery, { mesage: string, projects: ProjectEntity[], total: number }>,
        @inject(PROJECT_TYPES.ProjectDetailsUseCase) private readonly _projectDetailsUseCase: IExecute<string, { project: ProjectEntity[], message: string }>,
        @inject(PROJECT_TYPES.ApplyToProjectUseCase) private readonly _applyToProjectUseCase: IExecute<ApplyToProjectDTO, { message: string }>,
        @inject(PROJECT_TYPES.GetPendingApplicationUseCase) private readonly _getPendingApplicationUseCase: IExecute<string, ApplicationEntity[]>,
        @inject(PROJECT_TYPES.ApproveApplcationUseCase) private readonly _approveApplicationUseCase: IExecute<ApproveApplicationDTO, { message: string }>,
        @inject(PROJECT_TYPES.RejectApplicationUseCase) private readonly _rejectApplicationUseCase: IExecute<RejectApplicationDTO, { message: string }>,
        @inject(PROJECT_TYPES.GetMyCreatedProjectUseCase) private readonly _getMyCreatedProjectUseCase: IExecute<{ userId: string }, ProjectEntity[]>,
        @inject(PROJECT_TYPES.GetMyAppliedProjectUseCase) private readonly _getMyAppliedProjectUseCase: IExecute<{ userId: string }, ApplicationEntity[]>,
        @inject(PROJECT_TYPES.GetProjectMembersUseCase) private readonly _getProjectMembersUseCase: IExecute<GetProjectMembersQuery, ProjectEntity[]>,
        @inject(PROJECT_TYPES.DisableProjectUseCase) private readonly _disableProjectUseCase: IExecute<{ userId: string, projectId: string }, void>,
        @inject(PROJECT_TYPES.UpdateProjectUseCase) private readonly _updateProjectUseCase: IExecute<{ userId: string, projectId: string, dto: UpdateProjectDTO }, { message: string }>,
        @inject(PROJECT_TYPES.GetProjectForEditUseCase) private readonly _getProjectForEditUseCase: IExecute<{ userId: string, projectId: string }, ProjectEntity>
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
     * Updates a project based on projectId and logged-in userId.
     * @param req - Express request containing projectId in params and updated data in body.
     * @param res - Express response object.
     * @returns JSON with updated project data.
     */
    async editProject(req: Request, res: Response) {
        try {

            let { projectId } = req.params
            let userId = req.user.userId

            let result = await this._updateProjectUseCase.execute({ userId, projectId, dto: req.body })

            return successResponse(res, "", result)

        } catch (error) {
            console.log(error)
            return errorResponse(res,
                "Edit Project failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }


    /**
 * Fetches a project’s details for editing.
 * Ensures the logged-in user owns the project.
 * @param req - Express request containing projectId in params.
 * @param res - Express response object.
 * @returns JSON with editable project details.
 */
    async getProjectForEdit(req: Request, res: Response) {

        try {

            let { projectId } = req.params
            let userId = req.user.userId

            let result = await this._getProjectForEditUseCase.execute({ userId, projectId })

            return successResponse(res, "", result)

        } catch (error) {
            return errorResponse(res,
                "fetch Edit Project failed",
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

    /**
 * Allows a user to apply to join a project.
 * @param req - Express request containing projectId in params and application data in body.
 * @param res - Express response object.
 * @returns JSON with success message and application result.
 */
    async applyToProject(req: Request, res: Response) {

        try {

            const { projectId } = req.params;
            const userId = req.user.userId;

            let result = await this._applyToProjectUseCase.execute({
                ...req.body,
                userId,
                projectId,
            });

            return successResponse(res, result.message, result)

        } catch (error) {
            return errorResponse(res,
                "applyProject details failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }


    /**
 * Fetches all pending applications for a project.
 * @param req - Express request containing projectId in params.
 * @param res - Express response object.
 * @returns JSON list of pending applications.
 */
    async getPendingApplication(req: Request, res: Response) {
        try {
            const { projectId } = req.params
            const result = await this._getPendingApplicationUseCase.execute(projectId)
            return successResponse(res, "Pending applications fetched", result);
        } catch (error) {
            return errorResponse(res, "Failed to fetch applications", ServerErrorStatus.INTERNAL_SERVER_ERROR, error);

        }
    }


    /**
 * Approves a pending project application.
 * @param req - Express request containing projectId and applicationId in params.
 * @param res - Express response object.
 * @returns JSON with approval message.
 */
    async approveApplication(req: Request, res: Response) {
        try {

            const { projectId, applicationId } = req.params

            let result = await this._approveApplicationUseCase.execute({ projectId, applicationId })

            return successResponse(res, result.message)

        } catch (error) {
            return errorResponse(
                res,
                "Failed to approve application",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }



    /**
     * Rejects a project application.
     * @param req - Express request containing applicationId in params.
     * @param res - Express response object.
     * @returns JSON with rejection message.
     */
    async rejectApplication(req: Request, res: Response) {

        try {

            const { applicationId } = req.params

            let result = await this._rejectApplicationUseCase.execute({ applicationId })

            return successResponse(res, result.message)

        } catch (error) {
            return errorResponse(
                res,
                "Failed to reject application",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }



    /**
 * Fetches all projects created by the logged-in user.
 * @param req - Express request containing authenticated userId.
 * @param res - Express response object.
 * @returns JSON list of created projects.
 */
    async getMyCreatedProject(req: Request, res: Response) {

        try {

            let userId = req.user.userId
            const result = await this._getMyCreatedProjectUseCase.execute({ userId })

            return successResponse(res, '', result)

        } catch (error) {

            return errorResponse(
                res,
                "Failed to load created project",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }

    }


    /**
 * Fetches all projects the user has applied to.
 * @param req - Express request containing authenticated userId.
 * @param res - Express response object.
 * @returns JSON list of applied projects.
 */
    async getMyAppliedProject(req: Request, res: Response) {

        try {

            let userId = req.user.userId
            const result = await this._getMyAppliedProjectUseCase.execute({ userId })
            return successResponse(res, '', result)

        } catch (error) {

            return errorResponse(
                res,
                "Failed to load created project",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }

    }

    /**
 * Fetches project members with optional filters like search & pagination.
 * @param req - Express request containing projectId in params and query filters.
 * @param res - Express response object.
 * @returns JSON paginated list of project members.
 */
    async getProjectMember(req: Request, res: Response) {

        try {

            const { projectId } = req.params;
            const { search, page, limit } = req.query;


            let result = await this._getProjectMembersUseCase.execute({
                projectId,
                search: search as string,
                page: parseInt(page as string),
                limit: parseInt(limit as string)
            })

            return successResponse(res, 'Members fetched successfully', result)

        } catch (error) {
            return errorResponse(
                res,
                "Failed to load project members",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }


    /**
 * Disables a project created by the logged-in user.
 * @param req - Express request containing projectId in params.
 * @param res - Express response object.
 * @returns JSON confirmation of project disable action.
 */
    async disableProject(req: Request, res: Response) {
        try {

            const { projectId } = req.params
            const userId = req.user.userId

            const result = await this._disableProjectUseCase.execute({ userId, projectId })

            return successResponse(res, '', result)

        } catch (error) {
            return errorResponse(
                res,
                "Failed to disable project",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );

        }
    }
}