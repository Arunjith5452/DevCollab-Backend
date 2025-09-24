import { IsString } from "class-validator";
import { Expose } from "class-transformer";

@Expose()
export class RefreshDTO {
  @Expose()
  @IsString()
  refreshToken!: string;

  constructor(){
 
    this.refreshToken = ""

  }

}
