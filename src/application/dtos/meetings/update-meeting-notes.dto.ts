import { IsString, IsOptional } from "class-validator";
import { Expose } from "class-transformer";

export class UpdateMeetingNotesDTO {
    @Expose()
    @IsString()
    @IsOptional()
    notes!: string;

    @Expose()
    @IsString()
    @IsOptional()
    userId?: string;

    @Expose()
    @IsString()
    @IsOptional()
    userName?: string;
}
