import { Expose } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class ApplyToProjectDTO {

    @Expose()
    @IsArray({ message: "Tech stack must be an array" })
    @IsNotEmpty({ message: "Tech stack cannot be empty" })
    @IsString({ each: true, message: "Each techStack item must be a string" })
    techStack!: string[];

    @Expose()
    @IsNotEmpty({ message: "Profile URL is required" })
    @IsUrl({}, { message: "Invalid profile URL format" })
    profileUrl!: string;

    @Expose()
    @IsNotEmpty({ message: "Reason is required" })
    @IsString({ message: "Reason must be a string" })
    reason!: string;
}