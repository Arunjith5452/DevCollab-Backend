import { IsNumber, Min, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class GetSubscriptionsQueryDTO {
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page!: number;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit!: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    status?: string;
}
