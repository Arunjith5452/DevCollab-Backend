

import { UserEntity } from "@/domain/entities/user.entity";


export class UserApplicationMapper {
    toResponse(user:UserEntity):any{
        return {
            id:user.id,
            email:user.email,
            username:user.username,
        }
    }
} 