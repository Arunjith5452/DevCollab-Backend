import { Expose, Transform } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsObject,
} from "class-validator";

export class CreateCheckoutSessionDTO {
  @Expose()
  @IsNumber({}, { message: "Amount must be a number" })
  @Min(50, { message: "Amount must be at least 50 paise (₹0.50)" })
  amount!: number;

  @Expose()
  @IsOptional()
  @IsString({ message: "Currency must be a string" })
  currency?: string;

  @Expose()
  @IsObject({ message: "Metadata must be an object" })
  @Transform(({ obj }: { obj: any }) => obj.metadata)
  metadata!: Record<string, string>;

  @Expose()
  @IsOptional()
  @IsString()
  success_url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  cancel_url?: string;
}