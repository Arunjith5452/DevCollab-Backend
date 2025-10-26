export interface GetAllUsersQuery {
  search?: string ;
  role?: string ;
  status?: string;
  page?: number; 
  limit?: number;
}