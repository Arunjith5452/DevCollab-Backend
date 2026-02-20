import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class GetContributorStatsQueryDTO {
    @IsString()
    @IsNotEmpty()
    projectId!: string;

    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;
}
