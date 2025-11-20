import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Expose } from "class-transformer";

export class LoginDTO {

    @Expose()
    @IsEmail({}, { message: "Invalid email format" })
    email: string;

    @Expose()
    @IsString({ message: "Password must be a string" })
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @MaxLength(20, { message: "Password cannot be longer than 20 characters" })
    @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain at least one uppercase letter and one number",
    })
    password: string;
    
    @IsString() 
    @IsOptional() 
    googleId?: string;

    constructor() {
        this.email = "";
        this.password = "";
        this.googleId = ""
    }
}
