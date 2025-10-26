import { ContainerModule } from "inversify";
import {ADMIN_TYPES} from "../../types/index"
import { AdminController } from "@/presentation/http/controllers/admin.controller";
import { GetAllUsersUseCase } from "@/application/usecases/admin/implementations/getAllUsers.usecase";
import { UpdateUserStatusUseCase } from "@/application/usecases/admin/implementations/updateUserStatus.usecase";


export const AdminModule = new ContainerModule(({bind})=>{
bind<AdminController>(ADMIN_TYPES.AdminController).to(AdminController)
bind<GetAllUsersUseCase>(ADMIN_TYPES.GetAllUsersUseCase).to(GetAllUsersUseCase)
bind<UpdateUserStatusUseCase>(ADMIN_TYPES.UpdateUserStatusUseCase).to(UpdateUserStatusUseCase)

})