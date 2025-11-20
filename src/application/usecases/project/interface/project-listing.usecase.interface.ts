interface GetAllProjectsQuery {
  search?: string;
  techStack?: string;
  difficulty?: string;
  roleNeeded?: string;
  page: number;
  limit: number;
}