import { UserEntity } from "@/domain/entities/user.entity";
import { IBaseRepository } from "./base-repository.interface";


export interface IUserRepository<T> extends IBaseRepository<T> {
    findByEmail(email: string): Promise<T | null>
    updatePassword(userId: string, password: string): Promise<void>
    createUser(data: UserEntity): Promise<T>
    updateUser(userId: string, data: Partial<UserEntity>): Promise<T | null>;
    findEntityById(id: string): Promise<T | null>
    findEntityByIdWithToken(id: string): Promise<T | null>
    getDailyRegistrations(startDate: Date, endDate: Date): Promise<{ _id: string; count: number }[]>
}
