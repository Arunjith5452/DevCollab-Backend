import { UpdateStatusDTO } from "@/application/dtos/admin/updateStatus.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { GetAllUsersQuery } from "@/application/usecases/admin/interface/admin-usecase.interface";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { ADMIN_TYPES } from "@/infrastructure/di/types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminController {
    constructor(
        @inject(ADMIN_TYPES.GetAllUsersUseCase) private readonly _getAllUserUseCase: IExecute<GetAllUsersQuery, any>,
        @inject(ADMIN_TYPES.UpdateUserStatusUseCase) private readonly _updateUserStatusUseCase: IExecute<{userId:string,newStatus:UpdateStatusDTO}, { message: string, newStatus: string }>
    ) { }

    async GetAllUser(req: Request, res: Response) {
        try {

            const { search, role, status, page, limit } = req.query

            const query = {
                search: search as string,
                role: role as string,
                status: status as string,
                page: Number(page),
                limit: Number(limit)
            }

            const result = await this._getAllUserUseCase.execute(query);

            return res.json(result);

        } catch (error) {
            const err = error as Error;
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }


    async UpdateUserStatus(req: Request, res: Response) {
        try {

            const { newStatus } = req.body
            const userId = req.params.id
            const result = await this._updateUserStatusUseCase.execute({ userId,newStatus })

            return res.json(result)
        } catch (error) {
            const err = error as Error
            return res.status(500).json({ message: err.message })
        }
    }

}
