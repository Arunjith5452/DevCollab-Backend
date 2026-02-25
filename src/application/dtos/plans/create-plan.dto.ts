import { IsString, IsNotEmpty, IsNumber, Min, IsArray, IsOptional, IsEnum } from "class-validator";
import { PlanFeature } from "@/domain/enums/plan/plan-feature.enum";


export class CreatePlanDTO {
    @IsString({ message: "Plan name must be a string." })
    @IsNotEmpty({ message: "Plan name is required." })
    name!: string;

    @IsString({ message: "Description must be a string." })
    @IsNotEmpty({ message: "Description is required." })
    description!: string;

    @IsNumber({}, { message: "Price must be a valid number." })
    @Min(0, { message: "Price cannot be negative." })
    price!: number;

    @IsNumber({}, { message: "Duration in days must be a valid number." })
    @Min(1, { message: "Duration must be at least 1 day." })
    durationInDays!: number;

    @IsArray({ message: "Features must be a list." })
    @IsEnum(PlanFeature, { each: true, message: "Each feature must be a valid PlanFeature." })
    features!: PlanFeature[];


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
