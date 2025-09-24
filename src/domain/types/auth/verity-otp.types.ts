import { IUser } from "@/infrastructure/db/interface/user.inteface"

export type VerifyOtpResult = {
    user:IUser,
    message:string
}