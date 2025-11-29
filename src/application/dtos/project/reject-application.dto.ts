
import { Expose } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class RejectApplicationDTO {
  @Expose()
  @IsNotEmpty({ message: "Application ID is required" })
  @IsMongoId({ message: "Invalid Application ID format" })
  applicationId!: string;
  }