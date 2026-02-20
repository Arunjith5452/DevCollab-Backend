import { Expose, Transform } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsObject,
  IsIn
} from "class-validator";

export class CreateCheckoutSessionDTO {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "Amount must be a number" })
  @Min(50, { message: "Amount must be at least 50 paise (₹0.50)" })
  amount?: number;

  @Expose()
  @IsOptional()
  @IsString({ message: "Currency must be a string" })
  currency?: string;

  @Expose()
  @IsOptional()
  @IsObject({ message: "Metadata must be an object" })
  metadata?: Record<string, string>;

  @Expose()
  @IsOptional()
  @IsString()
  success_url?: string;

  @Expose()
  @IsOptional()
  @IsString()

  cancel_url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsIn(['payment', 'subscription'])
  mode?: 'payment' | 'subscription';

  @Expose()
  @IsOptional()
  @IsString()
  priceId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  planId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsIn(['SUBSCRIPTION', 'TASK_PAYMENT'])
  paymentType?: 'SUBSCRIPTION' | 'TASK_PAYMENT';
}