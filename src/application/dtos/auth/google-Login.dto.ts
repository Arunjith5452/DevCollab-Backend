import { IsEmail, IsOptional, IsString} from "class-validator";
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
  @IsOptional()
  @IsString({ message: "Google ID must be a string" })
  googleId!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Image URL must be a string" })
  image?: string;

  constructor() {
    this.email = "";
    this.name = "";
    this.googleId = "";
    this.image = "";
  }
}
