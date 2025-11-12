import { IsEmail, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class GoogleLoginDTO {
  
  @Expose()
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @Expose()
  @IsString({ message: "Name must be a string" })
  @IsOptional()
  name?: string;

  @Expose()
  @IsString({ message: "Google ID must be a string" })
  googleId!: string;

  constructor() {
    this.email = "";
    this.name = "";
    this.googleId = "";
  }
}
