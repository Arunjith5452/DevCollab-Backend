import { ResponseUserDto } from "@/application/dtos/auth/res/response.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserApplicationMapper } from "@/application/mapper/user-application.mapper";
import { UserEntity } from "@/domain/entities/user.entity";
import { Status } from "@/domain/enums/status.enums";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject } from "inversify";



export class CheckUserBlockStatusUseCase implements IExecute<string, ResponseUserDto> {
    private _userMapper;
    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<UserEntity>,
    ) {
        this._userMapper = new UserApplicationMapper()
    }

    async execute(userId: string): Promise<ResponseUserDto> {

        try {

            const user = await this._userRepository.findById(userId)

            if (!user) {
                throw new Error("user not found")
            }

            return this._userMapper.toResponse(user)

        } catch (error) {

            throw error

        }

    }

}