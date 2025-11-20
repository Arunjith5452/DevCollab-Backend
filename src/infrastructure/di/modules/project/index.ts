import { ProjectController } from "@/presentation/http/controllers/project.controller";
import { ContainerModule } from "inversify";
import { PROJECT_TYPES } from "../../types";
import { CreateProjectUseCase } from "@/application/usecases/project/implementations/create-project.usecase";
import { ProjectRepository } from "@/infrastructure/db/repository/implements/project.repository";
import { projectModel } from "@/infrastructure/db/models/project.model";
import { Model } from "mongoose";
import { ListProjectUseCase } from "@/application/usecases/project/implementations/listAll-project.usecase";
import { ProjectDetailsUseCase } from "@/application/usecases/project/implementations/project-details.usecase";




export const ProjectModule = new ContainerModule(({bind})=>{
    bind<ProjectRepository>(PROJECT_TYPES.ProjectRepository).to(ProjectRepository)
    bind<Model<any>>("ProjectModel").toConstantValue(projectModel)
    bind<ProjectController>(PROJECT_TYPES.ProjectController).to(ProjectController)
    bind<CreateProjectUseCase>(PROJECT_TYPES.CreateProjectUseCase).to(CreateProjectUseCase)
    bind<ListProjectUseCase>(PROJECT_TYPES.ListProjectUseCase).to(ListProjectUseCase)
    bind<ProjectDetailsUseCase>(PROJECT_TYPES.ProjectDetailsUseCase).to(ProjectDetailsUseCase)
})