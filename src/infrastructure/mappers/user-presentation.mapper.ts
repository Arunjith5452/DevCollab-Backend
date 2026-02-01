import { UserEntity } from "@/domain/entities/user.entity";
import { UserResponseDTO, UserActivity } from "@/application/dtos/user/res/user-response.dto";
import { injectable } from "inversify";

@injectable()
export class UserPresentationMapper {
    toResponseDTO(user: UserEntity, stats?: { createdProjects?: number, contributions?: number, activities?: UserActivity[] }): UserResponseDTO {
        return {
            id: user.id || "",
            name: user.username,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            bio: user.bio,
            title: user.title,
            techStack: user.techStack,
            githubProfile: user.githubProfile,
            createdProjectsCount: stats?.createdProjects || 0,
            contributionsCount: stats?.contributions || 0,
            recentActivities: stats?.activities || [],
            isGithubConnected: !!user.githubAccessToken
        };
    }
}
