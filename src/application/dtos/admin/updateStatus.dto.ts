import { Exclude, Expose } from "class-transformer"
import { IsOptional, IsString } from "class-validator"


@Exclude()
export class UpdateStatusDTO {     
    @Expose()
    @IsString()
    @IsOptional()
    newStatus:string
    
    constructor (){
        this.newStatus = ""
    }

}