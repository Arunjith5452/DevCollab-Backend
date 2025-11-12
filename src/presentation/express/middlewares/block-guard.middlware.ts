import { Request, Response, NextFunction } from "express"
import { CheckUserBlockStatusUseCase } from "@/application/usecases/auth/implementations/check-user-block-status.usecase"
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum"
import { Status } from "@/domain/enums/status.enums"
import { container } from "@/infrastructure/di/inversify.di"
import { AUTH_TYPES } from "@/infrastructure/di/types"

export const BlockGuard = (roles: Array<string>) =>async (req: Request, res: Response, next: NextFunction) => {
    try {

      const checkUserBlockStatusUseCase = container.get<CheckUserBlockStatusUseCase>(AUTH_TYPES.CheckUserBlockStatusUseCase)

      const user = await checkUserBlockStatusUseCase.execute(req.user?.userId!);

      if (user.status === Status.BLOCK) {

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        return res.status(401).json({ message: "Your account has been blocked by admin",success:false,blocked:true })
      }

      next()
    } catch (error) {
        console.log(error)
      return res
        .status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" })
    }
  };

