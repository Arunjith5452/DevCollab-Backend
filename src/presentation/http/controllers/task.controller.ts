import { CreateTaskDTO } from "@/application/dtos/tasks/create-task.dto";
import { GetContributorTasksQuery } from "@/application/dtos/tasks/get-contributor-tasks.dto";
import { TaskListItemDto } from "@/application/dtos/tasks/res/contributor-tasks-list-items.dto";
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



@injectable()
export class TaskController {

    constructor(
        @inject(TASK_TYPES.CreateTaskUseCase) private readonly _createTaskUseCase: IExecute<CreateTaskDTO, void>,
        @inject(TASK_TYPES.GetCreatorTasksUseCase) private readonly _getCreatorTaskUseCase: IExecute<GetAllTaskQuery, { message: string, tasks: TaskEntity[], total: number }>,
        @inject(TASK_TYPES.GetContributorTaskUseCase) private readonly _getContributorUseCase: IExecute<GetContributorTasksQuery, TaskListItemDto[]>,
        @inject(TASK_TYPES.GetProjectAssigneeUseCase) private readonly _getProjectAssigneeUseCase: IExecute<string, ProjectMemberNameOnly[]>
    ) { }

    /**
     * Creates a new task.
     * @param req - Express request containing task details in the body.
     * @param res - Express response object.
     * @returns JSON response with success message or error.
     */
    async createTask(req: Request, res: Response) {
        try {

            console.log("backend receving data of createTask >",req.body)

            const result = await this._createTaskUseCase.execute(req.body)

            return successResponse(res, "Task created successfully", result)

        } catch (error) {
            return errorResponse(res,
                "Task creation failed",
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
    async getCreatorTasks(req: Request, res: Response) {

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
                "Failed to fetch tasks",
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
    async getContributerTasks(req: Request, res: Response) {

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
                "Failed to fetch tasks",
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
    async getProjectAssignee(req: Request, res: Response) {
        try {

            let { projectId } = req.params
            const result = await this._getProjectAssigneeUseCase.execute(projectId)

            return successResponse(res, '', result)

        } catch (error) {
            return errorResponse(
                res,
                "Failed to fetch Project contributers",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

}