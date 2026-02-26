export interface GetAllProjectsQuery {
  search?: string;
  status?:string;
  difficulty?: string;
  page: number;
  limit: number;
}