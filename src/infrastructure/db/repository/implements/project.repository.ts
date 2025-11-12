import { ProjectEntity } from "@/domain/entities/project.entity";
import { BaseRepository } from "./base.repository";
import { IProjectRepository } from "../interface/project.interface";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ProjectPersistenceMapper } from "@/infrastructure/mappers/project-persistence.mapper";


@injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> implements IProjectRepository<ProjectEntity> {

    private readonly projectPersistenceMapper: ProjectPersistenceMapper;

    constructor(@inject("ProjectModel") model: Model<ProjectEntity>, projectPersistenceMapper: ProjectPersistenceMapper) {
        super(model)
        this.projectPersistenceMapper = projectPersistenceMapper
    }

    async createProject(data: ProjectEntity): Promise<ProjectEntity> {
        const mongoData = this.projectPersistenceMapper.toMongo(data)
        const createProject = await this.create(mongoData)
        return await this.projectPersistenceMapper.fromMongo(createProject)
    }

    async findByIdWithCreator(id:string):Promise<ProjectEntity | null>{
        const project = await this.model.findById(id)
        return project ? this.projectPersistenceMapper.fromMongo(project) : null
    }

}