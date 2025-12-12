import { IsString } from "class-validator";

export class LogoutDTO {
  @IsString()
  refreshToken!: string;

  constructor() {
    this.refreshToken = "";
  }
}
