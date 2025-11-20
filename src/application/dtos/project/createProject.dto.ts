import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsDateString,
  MinLength,
  MaxLength,
  ValidateNested,
  IsUrl,
  IsNumberString,
} from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";
import { Difficulty, Visibility } from "@/domain/enums/project";


class RequiredRoleDTO {
  @Expose()
  @IsString({ message: "Role name must be a string" })
  @MinLength(2, { message: "Role name must be at least 2 characters long" })
  @MaxLength(30, { message: "Role name cannot be longer than 30 characters" })
  role: string;

  @Expose()
  @IsNumberString({}, { message: "Count must be a number" })
  count: string;

  @Expose()
  @IsString({ message: "Experience must be a string (e.g., '2 years', '6 months', 'fresher')" })
  @MinLength(2, { message: "Experience level must be at least 2 characters long" })
  experience: string;

  constructor() {
    this.role = "";
    this.count = "";
    this.experience = "";
  }
}

@Exclude()
export class CreateProjectDTO {
  @Expose()
  @IsString({ message: "Project title must be a string" })
  @MinLength(3, { message: "Project title must be at least 3 characters long" })
  @MaxLength(50, { message: "Project title cannot be longer than 50 characters" })
  title: string;


  @Expose()
  @IsString({ message: "Description must be a string" })
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  description: string;

  @Expose()
  @IsOptional()
  @IsUrl({}, { message: "GitHub repository must be a valid URL" })
  githubRepo?: string;

  @Expose()
  @IsArray({ message: "Tech stack must be an array of strings" })
  @ArrayNotEmpty({ message: "Tech stack cannot be empty" })
  @IsString({ each: true, message: "Each tech stack item must be a string" })
  techStack: string[];

  @Expose()
  @IsEnum(Difficulty, { message: "Difficulty must be Beginner, Intermediate, or Advanced" })
  difficulty: Difficulty;

  @Expose()
  @IsDateString({}, { message: "Start date must be a valid date" })
  startDate: string;

  @Expose()
  @IsDateString({}, { message: "End date must be a valid date" })
  endDate: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Expectation must be a string" })
  @MaxLength(300, { message: "Expectation cannot exceed 300 characters" })
  expectation?: string;

  @Expose()
  @IsEnum(Visibility, { message: "Visibility must be public or private" })
  visibility: Visibility;

  @Expose()
  @IsString({ message: "Expectation must be a string" })
  @IsOptional()
  image?: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => RequiredRoleDTO)
  @ArrayNotEmpty({ message: "At least one team role is required" })
  requiredRoles: RequiredRoleDTO[];

  constructor() {
    this.title = "";
    this.description = "";
    this.githubRepo = "";
    this.techStack = [];
    this.difficulty = Difficulty.BEGINNER;
    this.startDate = "";
    this.endDate = "";
    this.expectation = "";
    this.visibility = Visibility.PUBLIC;
    this.image = '';
    this.requiredRoles = [];
  }
}
