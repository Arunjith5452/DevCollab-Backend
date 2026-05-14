import { UserEntity } from "@/domain/entities/user.entity";
import { ResponseUserDto } from "../dtos/auth/res/response.dto";


export class UserApplicationMapper {
    toResponse(user: UserEntity): ResponseUserDto {
        return {
            id: user.id,
            email: user.email,
            status: user.status,
            username: user.username,
            name: user.username,
            role: user.role,
            createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString()
        }
    }
}

