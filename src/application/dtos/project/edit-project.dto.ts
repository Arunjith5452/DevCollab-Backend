import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
  MinLength,
  MaxLength,
  ValidateNested,
  IsUrl,
  IsNumberString,
} from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";
import { Difficulty, Visibility } from "@/domain/enums/project";


class UpdateRequiredRoleDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: "Role name must be a string" })
  @MinLength(2, { message: "Role name must be at least 2 characters long" })
  @MaxLength(30, { message: "Role name cannot be longer than 30 characters" })
  role?: string;

  @Expose()
  @IsOptional()
  @IsNumberString({}, { message: "Count must be a number" })
  count?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Experience must be a string (e.g., '2 years', '6 months', 'fresher')" })
  @MinLength(2, { message: "Experience level must be at least 2 characters long" })
  experience?: string;
}


@Exclude()
export class UpdateProjectDTO {

  @Expose()
  @IsOptional()
  @IsString({ message: "Project title must be a string" })
  @MinLength(3, { message: "Project title must be at least 3 characters long" })
  @MaxLength(50, { message: "Project title cannot be longer than 50 characters" })
  title?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  description?: string;

  @Expose()
  @IsOptional()
  @IsUrl({}, { message: "GitHub repository must be a valid URL" })
  githubRepo?: string;

  @Expose()
  @IsOptional()
  @IsArray({ message: "Tech stack must be an array of strings" })
  @IsString({ each: true, message: "Each tech stack item must be a string" })
  techStack?: string[];

  @Expose()
  @IsOptional()
  @IsEnum(Difficulty, { message: "Difficulty must be Beginner, Intermediate, or Advanced" })
  difficulty?: Difficulty;

  @Expose()
  @IsOptional()
  @IsDateString({}, { message: "Start date must be a valid date" })
  startDate?: string;

  @Expose()
  @IsOptional()
  @IsDateString({}, { message: "End date must be a valid date" })
  endDate?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Expectation must be a string" })
  @MaxLength(300, { message: "Expectation cannot exceed 300 characters" })
  expectation?: string;

  @Expose()
  @IsOptional()
  @IsEnum(Visibility, { message: "Visibility must be public or private" })
  visibility?: Visibility;

  @Expose()
  @IsOptional()
  @IsString()
  image?: string;

  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateRequiredRoleDTO)
  requiredRoles?: UpdateRequiredRoleDTO[];

}
