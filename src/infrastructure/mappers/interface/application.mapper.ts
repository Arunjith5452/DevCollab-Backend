import { MongoProject } from "./project.mapper.interface";

export interface PopulatedUser {
  _id: string;
  name: string;
  email?: string;
  githubProfile?: string;
  bio?: string;
  profileImage?: string;
}

export interface MongoApplication {
  _id: string;
  userId: string | PopulatedUser;
  projectId: string | MongoProject | null;
  techStack: string[];
  profileUrl: string;
  reason: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface WithUser {
  user?: {
    name: string;
    github: string | null;
    bio: string | null;
    profileImage: string | null;
  };
}
