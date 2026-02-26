import { Expose } from "class-transformer"
import { IsEmail } from "class-validator"


export class ForgotResendOtp{

       @Expose()
        @IsEmail()
        email: string

        constructor(){
            this.email = ""
        }

}    