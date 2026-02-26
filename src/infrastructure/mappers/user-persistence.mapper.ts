import { UserEntity } from "@/domain/entities/user.entity";
import { IUser } from "../db/interface/user.inteface";
import { Document } from "mongoose";

import { IPersistenceMapper } from "./interface/persistence-mapper.interface";

export class UserPersistenceMapper implements IPersistenceMapper<UserEntity, IUser> {
    toMongo(user: UserEntity) {
        return {
            email: user.email,
            role: user.role as unknown as IUser['role'],
            password: user.password,
            name: user.username,
            status: user.status,
            bio: user.bio,
            title: user.title,
            techStack: user.techStack,
            profileImage: user.profileImage,
            googleId: user.googleId,
            githubProfile: user.githubProfile,
            githubAccessToken: user.githubAccessToken
        }
    }

    fromMongo(doc: IUser & Document): UserEntity {
        return UserEntity.create({
            id: doc._id.toString(),
            email: doc.email,
            username: doc.name,
            password: doc.password,
            role: doc.role,
            status: doc.status,
            googleId: doc?.googleId ?? undefined,
            profileImage: doc?.profileImage ?? undefined,
            githubProfile: doc?.githubProfile ?? undefined,
            bio: doc?.bio ?? undefined,
            title: doc?.title ?? undefined,
            techStack: doc?.techStack ?? undefined,
            githubAccessToken: doc?.githubAccessToken ?? undefined,
            createdAt: doc.createdAt
        })
    }
}
