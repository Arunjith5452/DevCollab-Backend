import { ObjectId } from "mongodb";

export interface MongoMember {
  userId: string | ObjectId;
  role: string;
  joinedAt: string;
  status: string;
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
