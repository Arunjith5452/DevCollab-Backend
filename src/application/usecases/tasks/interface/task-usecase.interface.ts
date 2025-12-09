export interface GetAllTaskQuery {
  projectId:string
  search?: string ;
  assignee?: string ;
  status?: string;
  page?: number; 
  limit?: number;
}