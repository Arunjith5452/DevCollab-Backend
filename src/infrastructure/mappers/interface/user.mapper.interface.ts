import { Types } from "mongoose";
type ObjectId = Types.ObjectId;

export interface MongoUser {
  _id: string | ObjectId;
  email: string;
  username: string;
  password: string;
  role: string;
  status: string;
  googleId?: string;
  profileImage?: string;
  githubProfile?: string;
}
