import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";


export class RequestImprovementDTO {
    @Expose()
    @IsNotEmpty({ message: "feeback is required" })
    @IsString()
    feedBack?: string
}