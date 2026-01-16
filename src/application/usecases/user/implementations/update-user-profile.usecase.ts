import { UpdateProfileDTO } from "@/application/dtos/user/updateProfile.dto";
import { deleteFile } from "@/infrastructure/providers/s3-bucket/s3Service";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { IUserRepository } from "@/infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateUserProfileUseCase implements IExecute<{ userId: string, dto: UpdateProfileDTO }, UserEntity | null> {

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>
    ) { }

    async execute({ userId, dto }: { userId: string, dto: UpdateProfileDTO }): Promise<UserEntity | null> {
        try {

            let user = await this._userRepository.findEntityById(userId)

            const oldProfileImage = user?.profileImage;

            user?.updateProfile(dto)

            // console.log("DTO:", dto);
            // console.log("Saving username:", dto.username);


            const updated = await this._userRepository.updateUser(userId, {
                username: dto?.username,
                bio: dto?.bio,
                title: dto?.title,
                techStack: dto.techStack,
                profileImage: user?.profileImage,
            })

            if (dto.profileImage && oldProfileImage && dto.profileImage !== oldProfileImage) {
                await deleteFile(oldProfileImage);
            }

            // console.log("updated",updated)

            return updated;

        } catch (error) {
            throw error
        }
    }
}
