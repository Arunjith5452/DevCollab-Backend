
import { Expose } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class ApproveApplicationDTO {
  @Expose()
  @IsNotEmpty({ message: "Application ID is required" })
  @IsMongoId({ message: "Invalid Application ID format" })
  applicationId!: string;

  @Expose()
  @IsNotEmpty({ message: "Project ID is required" })
  @IsMongoId({ message: "Invalid Project ID format" })
  projectId!: string;
}