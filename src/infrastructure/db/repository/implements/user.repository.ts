import { IUserRepositor } from "../interface/user.interface";
import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { UserEntity } from "@/domain/entities/user.entity";
import { Model } from "mongoose";
import { UserPersistenceMapper } from "@/infrastructure/mappers/user-persistence.mapper";

@injectable()
export class UserRepository extends BaseRepository<UserEntity> implements IUserRepositor<UserEntity> {
    private readonly userPersistenceMapper : UserPersistenceMapper;

    constructor(@inject("UserModel") model: Model<UserEntity>, userPersistanceMapper: UserPersistenceMapper) {
        super(model)
        this.userPersistenceMapper = userPersistanceMapper
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const doc = await this.findOne({ email })
        return doc ?  this.userPersistenceMapper.fromMongo(doc) : null
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        await this.update(userId, { password })
    }

    async createUser(data: UserEntity): Promise<UserEntity> {
        const mongoData = this.userPersistenceMapper.toMongo(data)
        const createUser = await this.create(mongoData)
        return await this.userPersistenceMapper.fromMongo(createUser)
    }

    async updateUser(userId : string , data:Partial<UserEntity>):Promise<UserEntity | null>{
        const update = await this.update(userId,data)
        return update ? this.userPersistenceMapper.fromMongo(update) : null
    }
   
    

}