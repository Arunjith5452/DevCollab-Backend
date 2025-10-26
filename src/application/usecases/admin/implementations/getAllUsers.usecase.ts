import { inject, injectable } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";
import { UserEntity } from "@/domain/entities/user.entity";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { GetAllUsersQuery } from "../interface/admin-usecase.interface";


@injectable()
export class GetAllUsersUseCase implements IExecute<GetAllUsersQuery, { message: string, users: UserEntity[], total: number }> {

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<UserEntity>) { }

    async execute(query: GetAllUsersQuery): Promise<{ message: string; users: UserEntity[]; total: number }> {
        try {

            const { search, role, status, page = 1, limit = 3 } = query

            const filter: any = {}

            
            if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
            if (role && role !== 'all') filter.role = role
            if (status && status !== 'all') filter.status = status
            
            const skip = (page - 1) * limit

            const [users,count] = await Promise.all([ this._userRepository.find(filter,{skip,limit}), this._userRepository.count(filter)])

            let total = Math.ceil(count / limit)

            return {
                message: SuccessMessage.USER_CREATED,
                users,
                total
            }

        } catch (error) {
            throw error
        }

    }

}