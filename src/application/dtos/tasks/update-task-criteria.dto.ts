import { IsArray, IsBoolean, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";

export class AcceptanceCriteriaItemDTO {
    @Expose()
    @IsString({ message: "Text must be a string" })
    text!: string;

    @Expose()
    @IsBoolean({ message: "Completed must be a boolean" })
    completed!: boolean;
}

export class UpdateTaskCriteriaDTO {
    @Expose()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AcceptanceCriteriaItemDTO)
    acceptanceCriteria!: AcceptanceCriteriaItemDTO[];
}
