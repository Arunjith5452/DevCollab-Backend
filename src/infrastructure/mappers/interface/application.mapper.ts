export interface MongoApplication {
  _id: string;
  userId: string | {
    _id: string;
    name: string;
    githubProfile?: string;
    bio?: string;
    profileImage?: string;
  };
  projectId: string;
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
