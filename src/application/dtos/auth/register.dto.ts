import {
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsAlpha,
} from "class-validator";
import { Exclude, Expose } from "class-transformer";

@ValidatorConstraint({ name: "passwordMatch", async: false })
class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, _args: ValidationArguments) {
    const obj = _args.object as RegisterDTO;
    return obj.password === confirmPassword;
  }

  defaultMessage(_args: ValidationArguments) {
    return "Confirm password must match the password";
  }
}

@Exclude()
export class RegisterDTO {
  @Expose()
  @IsString({ message: "Name must be a string" })
  @IsAlpha()
  @MinLength(4, { message: "Name must be at least 4 characters long" })
  @MaxLength(10, { message: "Name cannot be longer than 10 characters" })
  name: string;

  @Expose()
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @Expose()
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @MaxLength(20, { message: "Password cannot be longer than 20 characters" })
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: "Password must contain at least one uppercase letter and one number",
  })
  password: string;

  @Expose()
  @IsString({ message: "Confirm password must be a string" })
  @MinLength(6, { message: "Confirm password must be at least 6 characters long" })
  @MaxLength(20, { message: "Confirm password cannot be longer than 20 characters" })
  @Validate(PasswordMatchConstraint, { message: "Confirm password must match the password" })
  confirmPassword: string;

  constructor() {
    this.name = "";
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
  }
}
