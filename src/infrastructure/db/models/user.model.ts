import { model } from "mongoose";
import { userSchema } from "../schema/user.schema";
import { IUser } from "../interface/user.inteface";


export const userModel = model<IUser>('Users',userSchema)
