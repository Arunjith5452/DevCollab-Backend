import { Request, Response, NextFunction } from "express"
import { CheckUserBlockStatusUseCase } from "@/application/usecases/auth/implementations/check-user-block-status.usecase"
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum"
import { Status } from "@/domain/enums/status.enums"
import { ClientErrorStatus } from "@/domain/enums/status-codes/client-error-status.enum"
import { container } from "@/infrastructure/di/inversify.di"
import { AUTH_TYPES } from "@/infrastructure/di/types"

export const BlockGuard = (_roles: Array<string>) => async (req: Request, res: Response, next: NextFunction) => {
  try {

    if (!req.user?.userId) {
      return res.status(ClientErrorStatus.UNAUTHORIZED).json({ message: "User not authenticated", success: false })
    }

    const checkUserBlockStatusUseCase = container.get<CheckUserBlockStatusUseCase>(AUTH_TYPES.CheckUserBlockStatusUseCase)
    const user = await checkUserBlockStatusUseCase.execute(req.user.userId);
    if (user.status === Status.BLOCK) {

      res.clearCookie("accessToken")
      res.clearCookie("refreshToken")

      return res.status(401).json({ message: "Your account has been blocked by admin", success: false, blocked: true })
    }

    next()
  } catch {
    return res
      .status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" })
  }
};

