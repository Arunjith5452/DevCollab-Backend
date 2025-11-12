import { UserEntity } from "@/domain/entities/user.entity";


export class UserPersistenceMapper {
    toMongo(user: UserEntity): any {
        return {
            email: user.email,
            role: user.role,
            password: user.password,
            name: user.username,
            status: user.status
        }
    }

    async fromMongo(doc: any): Promise<UserEntity> {
        return UserEntity.create({
            id: doc._id?.toString(),
            email: doc.email,
            username: doc.name,
            password: doc.password,
            role: doc.role,
            status: doc.status
        })
    }
} 