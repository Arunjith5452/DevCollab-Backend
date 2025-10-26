import { UserEntity } from "@/domain/entities/user.entity";


export class UserpresitanceMapper {
    toMongo(user:UserEntity):any{
        return {
            email:user.email,
            role:user.role,
            password:user.password,
            username:user.username,
            status:user.status
        }
    }

    async fromMongo(doc:any):Promise<UserEntity>{
        return UserEntity.create({
            email:doc.email,
            id:doc._id,
            username:doc.username,
            password:doc.password,
            role:doc.role,
            status:doc.status
        })
    }
}