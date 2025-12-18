import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class SubmitWorkDTO {
    @Expose()
    @IsNotEmpty({ message: "GitHub PR link is required" })
    @IsUrl({}, { message: "PR link must be a valid URL (e.g., https://github.com/...)" })
    prLink!: string;

    @Expose()
    @IsString({ message: "Description must be a string" })
    workDescription?: string; 
}