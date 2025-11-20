import {
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
  IsArray,
  ArrayMinSize,
} from "class-validator";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UpdateProfileDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @MaxLength(30, { message: "Name cannot exceed 30 characters" })
  name?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Title must be a string" })
  @MaxLength(50, { message: "Title cannot exceed 50 characters" })
  title?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Bio must be a string" })
  @MaxLength(300, { message: "Bio cannot exceed 300 characters" })
  bio?: string;

  @Expose()
  @IsOptional()
  @IsArray({ message: "Tech stack must be an array" })
  @ArrayMinSize(1, { message: "Tech stack must include at least one item" })
  @IsString({ each: true, message: "Each tech stack item must be a string" })
  techStack?: string[];

  @Expose()
  @IsOptional()
  @IsUrl({}, { message: "Invalid GitHub URL format" })
  githubUrl?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Profile image must be a signed URL string" })
  @MaxLength(300, { message: "Profile image URL is too long" })
  profileImage?: string; // S3 signed URL

  constructor(data?: Partial<UpdateProfileDTO>) {
    this.name = data?.name;
    this.title = data?.title;
    this.bio = data?.bio;
    this.techStack = data?.techStack;
    this.githubUrl = data?.githubUrl;
    this.profileImage = data?.profileImage;
  }
}
