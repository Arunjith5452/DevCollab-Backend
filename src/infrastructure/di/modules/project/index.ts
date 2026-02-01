import { ProjectController } from "@/presentation/http/controllers/project.controller";
import { ContainerModule } from "inversify";
import { PROJECT_TYPES } from "../../types";
import { CreateProjectUseCase } from "@/application/usecases/project/implementations/create-project.usecase";
import { ProjectRepository } from "@/infrastructure/db/repository/implements/project.repository";
import { projectModel } from "@/infrastructure/db/models/project.model";
import { Model } from "mongoose";
import { ListProjectUseCase } from "@/application/usecases/project/implementations/listAll-project.usecase";
import { ProjectDetailsUseCase } from "@/application/usecases/project/implementations/project-details.usecase";
import { ApplyToProjectUseCase } from "@/application/usecases/project/implementations/apply-project.usecase";
import { ApplicationRepository } from "@/infrastructure/db/repository/implements/application.repository";
import { applicationModel } from "@/infrastructure/db/models/application.model";
import { GetPendingApplicationUseCase } from "@/application/usecases/project/implementations/getPending-application.usecase";
import { RejectApplicationUseCase } from "@/application/usecases/project/implementations/reject-application.usecase";
import { ApproveApplcationUseCase } from "@/application/usecases/project/implementations/approve-application.usecase";
import { GetMyCreatedProjectUseCase } from "@/application/usecases/project/implementations/get-my-created-projects.usecase";
import { GetMyAppliedProjectUseCase } from "@/application/usecases/project/implementations/get-my-applied-projects.usecase";
import { GetProjectMembersUseCase } from "@/application/usecases/project/implementations/get-team-members.usecase";
import { DisableProjectUseCase } from "@/application/usecases/project/implementations/disable-project.usecase";
import { UpdateProjectUseCase } from "@/application/usecases/project/implementations/edit-project.usecase";
import { GetProjectForEditUseCase } from "@/application/usecases/project/implementations/get-project-forEdit.usecase";
import { ProjectPresentationMapper } from "@/infrastructure/mappers/project-presentation.mapper";
import { ProjectPersistenceMapper } from "@/infrastructure/mappers/project-persistence.mapper";
import { ApplicationPresentationMapper } from "@/infrastructure/mappers/application-presentation.mapper";
import { ApplicationPersistenceMapper } from "@/infrastructure/mappers/application-persistence.mapper";
import { GitHubService } from "@/infrastructure/services/github.service";


export const ProjectModule = new ContainerModule(({ bind }) => {
    bind<ProjectPresentationMapper>(ProjectPresentationMapper).toSelf().inSingletonScope()
    bind<ProjectPersistenceMapper>(ProjectPersistenceMapper).toSelf().inSingletonScope()
    bind<ApplicationPresentationMapper>(ApplicationPresentationMapper).toSelf().inSingletonScope()
    bind<ApplicationPersistenceMapper>(ApplicationPersistenceMapper).toSelf().inSingletonScope()
    bind<ProjectRepository>(PROJECT_TYPES.ProjectRepository).to(ProjectRepository)
    bind<Model<any>>("ProjectModel").toConstantValue(projectModel)
    bind<ProjectController>(PROJECT_TYPES.ProjectController).to(ProjectController)
    bind<CreateProjectUseCase>(PROJECT_TYPES.CreateProjectUseCase).to(CreateProjectUseCase)
    bind<ListProjectUseCase>(PROJECT_TYPES.ListProjectUseCase).to(ListProjectUseCase)
    bind<ProjectDetailsUseCase>(PROJECT_TYPES.ProjectDetailsUseCase).to(ProjectDetailsUseCase)
    bind<ApplyToProjectUseCase>(PROJECT_TYPES.ApplyToProjectUseCase).to(ApplyToProjectUseCase)
    bind<ApplicationRepository>(PROJECT_TYPES.ApplicationRepository).to(ApplicationRepository)
    bind<Model<any>>("ApplicationModel").toConstantValue(applicationModel)
    bind<GetPendingApplicationUseCase>(PROJECT_TYPES.GetPendingApplicationUseCase).to(GetPendingApplicationUseCase)
    bind<ApproveApplcationUseCase>(PROJECT_TYPES.ApproveApplcationUseCase).to(ApproveApplcationUseCase)
    bind<RejectApplicationUseCase>(PROJECT_TYPES.RejectApplicationUseCase).to(RejectApplicationUseCase)
    bind<GetMyCreatedProjectUseCase>(PROJECT_TYPES.GetMyCreatedProjectUseCase).to(GetMyCreatedProjectUseCase)
    bind<GetMyAppliedProjectUseCase>(PROJECT_TYPES.GetMyAppliedProjectUseCase).to(GetMyAppliedProjectUseCase)
    bind<GetProjectMembersUseCase>(PROJECT_TYPES.GetProjectMembersUseCase).to(GetProjectMembersUseCase)
    bind<DisableProjectUseCase>(PROJECT_TYPES.DisableProjectUseCase).to(DisableProjectUseCase)
    bind<UpdateProjectUseCase>(PROJECT_TYPES.UpdateProjectUseCase).to(UpdateProjectUseCase)
    bind<GetProjectForEditUseCase>(PROJECT_TYPES.GetProjectForEditUseCase).to(GetProjectForEditUseCase)
    bind<GitHubService>(PROJECT_TYPES.GitHubService).to(GitHubService)
})