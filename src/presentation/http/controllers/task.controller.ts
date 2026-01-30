import { CreateTaskDTO } from "@/application/dtos/tasks/create-task.dto";
import { AddCommentDTO } from "@/application/dtos/tasks/add-comment.dto";
import { StartTaskDTO } from "@/application/dtos/tasks/start-task.dto";
import { GetContributorTasksQuery } from "@/application/dtos/tasks/get-contributor-tasks.dto";
import { ProjectMemberNameOnly } from "@/application/dtos/tasks/res/get-project-members.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { GetAllTaskQuery } from "@/application/usecases/tasks/interface/task-usecase.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { errorResponse, successResponse } from "@/shared/utils/response.util";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { SubmitWorkDTO } from "@/application/dtos/tasks/submit-work.dto";
import { TaskListItemDto } from "@/application/dtos/tasks/res/list-task.dto";
import { RequestImprovementDTO } from "@/application/dtos/tasks/request-improvement.dto";
import { MESSAGES } from "@/shared/constants/messages";



@injectable()
export class TaskController {

    constructor(
        @inject(TASK_TYPES.CreateTaskUseCase) private readonly _createTaskUseCase: IExecute<CreateTaskDTO, TaskEntity>,
        @inject(TASK_TYPES.GetCreatorTasksUseCase) private readonly _getCreatorTaskUseCase: IExecute<GetAllTaskQuery, { message: string, tasks: TaskEntity[], total: number }>,
        @inject(TASK_TYPES.GetContributorTaskUseCase) private readonly _getContributorUseCase: IExecute<GetContributorTasksQuery, TaskListItemDto[]>,
        @inject(TASK_TYPES.GetProjectAssigneeUseCase) private readonly _getProjectAssigneeUseCase: IExecute<string, ProjectMemberNameOnly[]>,
        @inject(TASK_TYPES.AddCommentUseCase) private readonly _addCommentUseCase: IExecute<AddCommentDTO, void>,
        @inject(TASK_TYPES.StartTaskUseCase) private readonly _startTaskUseCase: IExecute<StartTaskDTO, void>,
        @inject(TASK_TYPES.SubmitWorkUseCase) private readonly _submitWorkUseCase: IExecute<{ userId: string, taskId: string, data: SubmitWorkDTO }, void>,
        @inject(TASK_TYPES.RequestImprovementUseCase) private readonly _requestImprovementUseCase: IExecute<{ userId: string, taskId: string, data: RequestImprovementDTO }, void>,
        @inject(TASK_TYPES.ApproveTaskUseCase) private readonly _approveTaskUseCase: IExecute<{ userId: string, taskId: string }, void>
    ) { }

    /**
     * Creates a new task.
     * @param req - Express request containing task details in the body.
     * @param res - Express response object.
     * @returns JSON response with success message or error.
     */
    async createTask(req: Request, res: Response): Promise<Response> {
        try {

            console.log("backend receving data of createTask >", req.body)

            const result = await this._createTaskUseCase.execute(req.body)

            return successResponse(res, MESSAGES.TASK.SUCCESS.CREATED, result)

        } catch (error) {
            return errorResponse(res,
                MESSAGES.TASK.ERROR.CREATION_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    /**
    * Fetches all tasks created by the task creator with optional filters
    * like search, assignee, status, pagination, and projectId.
    * @param req - Express request containing query parameters.
    * @param res - Express response object.
    * @returns JSON with paginated tasks list and total count.
    */
    async getCreatorTasks(req: Request, res: Response): Promise<Response> {

        try {

            const { search, assignee, status, page, limit, projectId } = req.query;

            const query = {
                search: search as string,
                assignee: assignee as string,
                status: status as string,
                page: Number(page),
                limit: Number(limit),
                projectId: projectId as string
            };

            const result = await this._getCreatorTaskUseCase.execute(query)

            return successResponse(res, result.message, {
                tasks: result.tasks,
                total: result.total
            })

        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.TASK.ERROR.FETCH_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }


    /**
    * Fetches tasks assigned to a contributor (logged-in user) 
    * filtered by projectId and optional status.
    * @param req - Express request containing params projectId and status.
    * @param res - Express response object.
    * @returns JSON list of contributor tasks.
    */
    async getContributerTasks(req: Request, res: Response): Promise<Response> {

        try {

            const { projectId, status } = req.params

            const userId = req.user.userId

            const query = {
                userId: userId as string,
                projectId: projectId as string,
                status: status as TaskStatus

            }

            const result = await this._getContributorUseCase.execute(query)

            return successResponse(res, '', result)

        } catch (error) {
            console.log("console.ller", error)
            return errorResponse(
                res,
                MESSAGES.TASK.ERROR.FETCH_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    /**
     * Fetches all project members who can be assigned tasks
     * based on the provided projectId.
     * @param req - Express request containing projectId in params.
     * @param res - Express response object.
     * @returns JSON list of assignee users (name only).
     */
    async getProjectAssignee(req: Request, res: Response): Promise<Response> {
        try {

            let { projectId } = req.params
            const result = await this._getProjectAssigneeUseCase.execute(projectId)

            return successResponse(res, '', result)

        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.TASK.ERROR.CONTRIBUTORS_FETCH_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    /**
     * Adds a comment to a task.
     * @param req - Express request containing taskId in params and message in body.
     * @param res - Express response object.
     * @returns JSON response with success message.
     */
    async addComment(req: Request, res: Response): Promise<Response> {
        try {
            const { taskId } = req.params;
            const { message } = req.body;
            const userId = req.user.userId;

            await this._addCommentUseCase.execute({ taskId, message, userId });

            return successResponse(res, MESSAGES.TASK.SUCCESS.COMMENT_ADDED);
        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.TASK.ERROR.COMMENT_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    async startTask(req: Request, res: Response): Promise<Response> {
        try {
            const { taskId } = req.params;
            const userId = req.user.userId;

            await this._startTaskUseCase.execute({ taskId, userId });

            return successResponse(res, MESSAGES.TASK.SUCCESS.STARTED);
        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.TASK.ERROR.START_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }


    async submitTask(req: Request, res: Response): Promise<Response> {
        try {
            const { taskId } = req.params;
            const userId = req.user.userId;

            await this._submitWorkUseCase.execute({ taskId, userId, data: req.body });

            return successResponse(res, MESSAGES.TASK.SUCCESS.SUBMITTED);
        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.TASK.ERROR.SUBMIT_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    async requestImprovement(req: Request, res: Response): Promise<Response> {
        try {

            let { taskId } = req.params
            let userId = req.user.userId

            console.log(taskId, req.body)

            await this._requestImprovementUseCase.execute({ userId, taskId, data: req.body })

            return successResponse(res, MESSAGES.TASK.SUCCESS.REQUEST_IMPROVEMENT)

        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.TASK.ERROR.REQUEST_IMPROVEMENT_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    async approveTask(req: Request, res: Response): Promise<Response> {
        try {

            let { taskId } = req.params
            let userId = req.user.userId

            await this._approveTaskUseCase.execute({ userId, taskId })

            return successResponse(res, MESSAGES.TASK.SUCCESS.APPROVED)

        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.TASK.ERROR.APPROVAL_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }



}