import { UpdateProfileDTO } from "@/application/dtos/user/updateProfile.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateUserProfileUseCase implements IExecute<{ userId: string, dto: UpdateProfileDTO }, UserEntity | null> {

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<UserEntity>
    ) { }

    async execute({ userId, dto }: { userId: string, dto: UpdateProfileDTO }): Promise<UserEntity | null> {
        try {

            let user = await this._userRepository.findById(userId)
            
            user?.updateProfile(dto)
            console.log("dto",dto)

            const updated = await this._userRepository.updateUser(userId, {
                username: user?.username,
                bio: dto?.bio,
                title: dto?.title,
                techStack: dto.techStack,
                profileImage: user?.profileImage,
            })

            console.log("lalalalalalal",updated)

            return updated;

        } catch (error) {
            throw error
        }
    }
}
