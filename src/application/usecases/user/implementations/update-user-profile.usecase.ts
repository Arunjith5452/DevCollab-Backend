import { UpdateProfileDTO } from "@/application/dtos/user/updateProfile.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { IUserRepository } from "@/domain/repository/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";

import { UserPresentationMapper } from "@/infrastructure/mappers/user-presentation.mapper";
import { UserResponseDTO } from "@/application/dtos/user/res/user-response.dto";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { IStorageService } from "@/application/interface/storage.service.interface";

@injectable()
export class UpdateUserProfileUseCase implements IExecute<{ userId: string, dto: UpdateProfileDTO }, UserResponseDTO | null> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(USER_TYPES.UserPresentationMapper) private readonly _userPresentationMapper: UserPresentationMapper,
        @inject(COMMON_TYPES.StorageService) private readonly _storageService: IStorageService
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

            const updateData: Partial<UserEntity> & { name?: string } = {
                bio: dto?.bio,
                title: dto?.title,
                techStack: dto.techStack,
                profileImage: user?.profileImage,
                githubAccessToken: dto?.githubAccessToken,
                githubProfile: dto?.githubProfile,
            };

            if (dto?.username) {
                updateData.name = dto.username;
            }

            const updated = await this._userRepository.updateUser(userId, updateData as Partial<UserEntity>)

            if (dto.profileImage && oldProfileImage && dto.profileImage !== oldProfileImage) {
                await this._storageService.deleteFile(oldProfileImage);
            }

            return updated ? this._userPresentationMapper.toResponseDTO(updated) : null;

        } catch (error) {
            throw error
        }
    }
}
