import { hash } from "@/shared/utils/password-hash.utils";

export class UserEntity{
    constructor(
        public  name:string,
        public  email:string,
        public  password:string,
    ){}

    setPassword(newPassword:string){
        this.password = newPassword
    }
    
    async getHashedPassword(){
        return await hash(this.password)
    }
}