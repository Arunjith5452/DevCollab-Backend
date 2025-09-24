import { HydratedDocument } from "mongoose";
import { UserEntity } from "@/domain/entities/user.entity";

export interface IUserRepositor<T> {
    createUser(users: UserEntity): Promise<HydratedDocument<T>>;
    getUserByEmail(email: string): Promise<HydratedDocument<T> | null>;
}
