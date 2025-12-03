import { CreateTaskDTO } from "@/application/dtos/tasks/create-task.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { TASK_TYPES } from "@/infrastructure/di/types";
import { errorResponse, successResponse } from "@/shared/utils/response.util";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";



@injectable()
export class TaskController {

    constructor(@inject(TASK_TYPES.CreateTaskUseCase) private readonly _createTaskUseCase: IExecute<CreateTaskDTO , void>) { }

    async createTask(req: Request, res: Response) {
        console.log("controllert createtask",req.body)
        try {


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

}