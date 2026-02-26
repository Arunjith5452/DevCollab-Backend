import { ProjectMemberNameOnly } from "@/application/dtos/tasks/res/get-project-members.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { IProjectRepository, } from "@/domain/repository/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject } from "inversify";

export class GetProjectAssigneeUseCase implements IExecute<string, ProjectMemberNameOnly[]> {

    constructor(
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }

    async execute(projectId: string): Promise<ProjectMemberNameOnly[]> {
        try {
            const projectAssignees = await this._projectRepository.getProjectMembersForAssignee(projectId)

            return projectAssignees

        } catch (error) {
            throw error;
        }
    }
}
