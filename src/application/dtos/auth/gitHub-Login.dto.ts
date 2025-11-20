import { IsEmail, IsOptional, isString, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class GithubLoginDTO {

  @Expose()
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @Expose()
  @IsString({ message: "Name must be a string" })
  @IsOptional()
  name?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Image URL must be a string" })
  image?: string;      

  @Expose()
  @IsOptional()
  @IsString({ message: "github URL must be a string" })
  githubUrl?:string

  constructor() {
    this.email = "";
    this.name = "";
    this.image = "";
    this.githubUrl = ""
  }
}
