import { FilterQuery, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
  create(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  find(filter: FilterQuery<T>,query:{skip:number,limit:number}): Promise<T[]>;           
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  update(id: string, update: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  count(filter: FilterQuery<T>): Promise<number>;                             
}
