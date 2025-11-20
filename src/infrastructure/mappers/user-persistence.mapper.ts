import { UserEntity } from "@/domain/entities/user.entity";
import { IUser } from "../db/interface/user.inteface";


export class UserPersistenceMapper {
    toMongo(user: UserEntity) {
        return {
            email: user.email,
            role: user.role,
            password: user.password,
            name: user.username,
            status: user.status,
            bio: user.bio,
            profileImage: user.profileImage,
            title: user.title,
            googleId: user.googleId,
            githubProfile:user.githubProfile
        }
    }

    async fromMongo(doc:any): Promise<UserEntity> {
        return UserEntity.create({
            id: doc._id.toString(),
            email: doc.email,
            username: doc.username,
            password: doc.password,
            role: doc.role,
            status: doc.status,
            googleId: doc?.googleId,
            profileImage:doc?.profileImage,
            githubProfile:doc?.githubProfile

        })
    }
} 


