import { Expose } from "class-transformer"
import { IsString } from "class-validator"


export class ResendOtp{

       @Expose()
        @IsString({ message: "Token is required" })
        token: string

        constructor(){
            this.token = ""
        }

}