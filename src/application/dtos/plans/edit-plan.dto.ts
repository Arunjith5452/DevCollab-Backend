import { IsString, IsNotEmpty, IsNumber, Min, IsArray, IsOptional, IsEnum } from "class-validator";
import { PlanFeature } from "@/domain/enums/plan/plan-feature.enum";


export class EditPlanDTO {
    @IsString({ message: "Plan ID must be a valid string." })
    @IsNotEmpty({ message: "Plan ID is required for editing." })
    id!: string;

    @IsOptional()
    @IsString({ message: "Plan name must be a string." })
    @IsNotEmpty({ message: "Plan name cannot be empty." })
    name?: string;

    @IsOptional()
    @IsString({ message: "Description must be a string." })
    @IsNotEmpty({ message: "Description cannot be empty." })
    description?: string;

    @IsOptional()
    @IsNumber({}, { message: "Price must be a valid number." })
    @Min(0, { message: "Price cannot be negative." })
    price?: number;

    @IsOptional()
    @IsNumber({}, { message: "Duration in days must be a valid number." })
    @Min(1, { message: "Duration must be at least 1 day." })
    durationInDays?: number;

    @IsOptional()
    @IsArray({ message: "Features must be a list." })
    @IsEnum(PlanFeature, { each: true, message: "Each feature must be a valid PlanFeature." })
    features?: PlanFeature[];


    @IsOptional()
    @IsNumber({}, { message: "Project limit must be a valid number." })
    @Min(1, { message: "Project limit must be at least 1." })
    projectLimit?: number;

    @IsOptional()
    @IsNumber({}, { message: "Max contributors must be a valid number." })
    @Min(1, { message: "Max contributors must be at least 1." })
    maxContributors?: number;

    @IsOptional()
    @IsNumber({}, { message: "Participation limit must be a valid number." })
    @Min(1, { message: "Participation limit must be at least 1." })
    participationLimit?: number;
}
