import { ContainerModule } from "inversify";
import { ADMIN_TYPES } from "../../types/index"
import { AdminController } from "@/presentation/http/controllers/admin.controller";
import { GetAllUsersUseCase } from "@/application/usecases/admin/implementations/get-all-users.usecase";
import { UpdateUserStatusUseCase } from "@/application/usecases/admin/implementations/updateUserStatus.usecase";
import { GetAllProjectsUseCase } from "@/application/usecases/admin/implementations/get-all-projects.usecase";
import { GetAdminDashboardStatsUseCase } from "@/application/usecases/admin/implementations/get-dashboard-stats.usecase";
import { GetAdminActivitiesUseCase } from "@/application/usecases/admin/implementations/get-activities.usecase";


export const AdminModule = new ContainerModule(({ bind }) => {
    bind<AdminController>(ADMIN_TYPES.AdminController).to(AdminController)
    bind<GetAllUsersUseCase>(ADMIN_TYPES.GetAllUsersUseCase).to(GetAllUsersUseCase)
    bind<UpdateUserStatusUseCase>(ADMIN_TYPES.UpdateUserStatusUseCase).to(UpdateUserStatusUseCase)
    bind<GetAllProjectsUseCase>(ADMIN_TYPES.GetAllProjectsUseCase).to(GetAllProjectsUseCase)
    bind<GetAdminDashboardStatsUseCase>(ADMIN_TYPES.GetAdminDashboardStatsUseCase).to(GetAdminDashboardStatsUseCase)
    bind<GetAdminActivitiesUseCase>(ADMIN_TYPES.GetAdminActivitiesUseCase).to(GetAdminActivitiesUseCase)
})