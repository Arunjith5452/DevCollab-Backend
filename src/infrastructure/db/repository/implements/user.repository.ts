import { IUserRepository } from "../interface/user.interface";
import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { UserEntity } from "@/domain/entities/user.entity";
import { Model } from "mongoose";
import { UserPersistenceMapper } from "@/infrastructure/mappers/user-persistence.mapper";
import { IUser } from "../../interface/user.inteface";

@injectable()
export class UserRepository extends BaseRepository<UserEntity, IUser> implements IUserRepository<UserEntity> {

    constructor(
        @inject("UserModel") model: Model<IUser>,
        @inject(UserPersistenceMapper) mapper: UserPersistenceMapper
    ) {
        super(model, mapper)
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.findOne({ email });
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        await this.update(userId, { password });
    }

    async createUser(data: UserEntity): Promise<UserEntity> {
        return this.create(data);
    }

    async updateUser(userId: string, data: Partial<UserEntity>): Promise<UserEntity | null> {
        return this.update(userId, data);
    }

    async findEntityById(id: string): Promise<UserEntity | null> {
        return this.findById(id);
    }

    async findEntityByIdWithToken(id: string): Promise<UserEntity | null> {
        const doc = await this.model.findById(id).select('+githubAccessToken');
        if (!doc) return null;
        return this.mapper.fromMongo(doc);
    }
}