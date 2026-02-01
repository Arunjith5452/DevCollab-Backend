import { UpdateProfileDTO } from "@/application/dtos/user/updateProfile.dto";
import { deleteFile } from "@/infrastructure/providers/s3-bucket/s3Service";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { IUserRepository } from "@/infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";

import { UserPresentationMapper } from "@/infrastructure/mappers/user-presentation.mapper";
import { UserResponseDTO } from "@/application/dtos/user/res/user-response.dto";

@injectable()
export class UpdateUserProfileUseCase implements IExecute<{ userId: string, dto: UpdateProfileDTO }, UserResponseDTO | null> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(USER_TYPES.UserPresentationMapper) private readonly _userPresentationMapper: UserPresentationMapper
    ) { }

    async execute({ userId, dto }: { userId: string, dto: UpdateProfileDTO }): Promise<UserResponseDTO | null> {
        try {

            let user = await this._userRepository.findEntityById(userId)

            const oldProfileImage = user?.profileImage;

            user?.updateProfile({
                name: dto?.username,
                bio: dto?.bio,
                title: dto?.title,
                profileImage: dto?.profileImage,
                techStack: dto?.techStack
            })

            const updated = await this._userRepository.updateUser(userId, {
                name: dto?.username,
                bio: dto?.bio,
                title: dto?.title,
                techStack: dto.techStack,
                profileImage: user?.profileImage,
                githubAccessToken: dto?.githubAccessToken,
                githubProfile: dto?.githubProfile,
            } as any)

            console.log("dto.profileImage:", dto.profileImage, ":oldProfileImage:", oldProfileImage)

            if (dto.profileImage && oldProfileImage && dto.profileImage !== oldProfileImage) {
                console.log("indside", oldProfileImage)
                await deleteFile(oldProfileImage);
            }

            console.log("updated", updated)

            return updated ? this._userPresentationMapper.toResponseDTO(updated) : null;

        } catch (error) {
            throw error
        }
    }
}
