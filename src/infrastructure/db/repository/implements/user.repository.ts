import { IUserRepositor } from "../interface/user.interface";
import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { UserEntity } from "@/domain/entities/user.entity";
import { Model } from "mongoose";
import { UserpresitanceMapper } from "@/infrastructure/mappers/user-presistance.mappers";

@injectable()
export class UserRepository extends BaseRepository<UserEntity> implements IUserRepositor<UserEntity> {
    private readonly userPersistatnceMapper: UserpresitanceMapper;

    constructor(@inject("UserModel") model: Model<UserEntity>, userPersistanceMapper: UserpresitanceMapper) {
        super(model)
        this.userPersistatnceMapper = userPersistanceMapper
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const doc = await this.findOne({ email })
        return doc ? this.userPersistatnceMapper.fromMongo(doc) : null
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        this.update(userId, { password })
    }

    async createUser(data: UserEntity): Promise<UserEntity> {
        const mongoData = this.userPersistatnceMapper.toMongo(data)
        const createUser = await this.create(mongoData)
        return this.userPersistatnceMapper.fromMongo(createUser)
    }

}