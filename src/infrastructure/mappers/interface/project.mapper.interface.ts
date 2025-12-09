import { ObjectId } from "mongodb";

export interface MongoUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface MongoMember {
  userId: string | MongoUser;
  role: string;
  status: string;
  joinedAt: Date;
}

export interface MongoProject {
  _id: string | ObjectId;
  creatorId: string | ObjectId;
  title: string;
  description: string;
  githubRepo?: string;
  techStack: string[];
  difficulty: string;
  startDate: Date;
  endDate: Date;
  expectation?: string;
  visibility: string;
  requiredRoles: { role: string; count: string; experience: string }[];
  status?: string;
  createdAt: Date;
  updatedAt?: Date;
  image?: string;
  members: MongoMember[];
}

export interface Member {
  userId: string;
  role: string;
  status: string;
  joinedAt: string;
}

export interface MemberWithUser extends Member {
  user?: {
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
}
