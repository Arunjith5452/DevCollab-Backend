import { Expose } from "class-transformer"
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator"



export class VerifyForgotOtpDTO {
  @Expose()
    @IsEmail({}, { message: "Invalid email format" })
    email: string

    @Expose()
    @IsString({ message: "OTP must be a string" })
    @MinLength(4, { message: "OTP must be at least 4 characters long" })
    @MaxLength(6, { message: "OTP cannot be longer than 6 characters" })
    otp: string

    constructor() {
        this.email = ""
        this.otp = ""
    }

}
