import { hash } from "@/shared/utils/password-hash.utils";

export class UserEntity {
  private readonly _id?: string;
  private _email: string;
  private _password: string;
  private _username: string;
  private _role :string;
  private _status:string;

  private constructor(
    email: string,
    password: string,
    username: string,
    role:string,
    status:string,
    id?: string,
  ) {
    this._email = email;
    this._password = password;
    this._username = username;
    this._role = role;
    this._status = status;
    this._id = id;
  }

//   async updateDetails(updateDto: UpdateUserDto) {
//     if (updateDto.email) await this.changeEmail(updateDto.email);
//     if (updateDto.password) await this.changePassowrd(updateDto.password);
//     if (updateDto.username) this.changeUsername(updateDto.username);
//   }

  static  create(data: {
    email: string;
    password: string;
    username: string;
    role:string;
    status:string;
    id?: string;
  }): UserEntity {
    // const email = Email.create(data.email);
    // const hashedPassword = await Password.create(data.password);
    return new UserEntity(data.email, data.password, data.username,data.role,data.status, data.id);
  }

  get id(): string | undefined {
    return this._id;
  }

  get email(): string {
    return this._email
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password
  }

  get role() : string{
    return this._role
  }

  get status() : string{
    return this._status
  }


   setPassword(newPassword:string){
        this._password = newPassword
    }
    
    async getHashedPassword(){
        return await hash(this.password)
    }
 

}