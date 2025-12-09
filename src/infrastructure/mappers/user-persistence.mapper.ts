import { UserEntity } from "@/domain/entities/user.entity";
import { MongoUser } from "./interface/user.mapper.interface";


export class UserPersistenceMapper {
    toMongo(user: UserEntity) {
        return {
            email: user.email,
            role: user.role,
            password: user.password,
            name: user.username,
            status: user.status,
            bio: user.bio,
            title: user.title,
            techStack: user.techStack,
            profileImage: user.profileImage,
            googleId: user.googleId,
            githubProfile: user.githubProfile
        }
    }

    async fromMongo(doc: any): Promise<UserEntity> {
        return UserEntity.create({
            id: doc._id.toString(),
            email: doc.email,
            username: doc.name,
            password: doc.password,
            role: doc.role,
            status: doc.status,
            googleId: doc?.googleId,
            profileImage: doc?.profileImage,
            githubProfile: doc?.githubProfile,
        })
    }
}


