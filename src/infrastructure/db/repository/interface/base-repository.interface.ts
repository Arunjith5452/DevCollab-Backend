import { FilterQuery, HydratedDocument, UpdateQuery } from "mongoose"

export interface IBaseRepository<T> {
    create(item: Partial<HydratedDocument<T>>): Promise<T>
    findById(id: string): Promise<HydratedDocument<T> | null>
    findAll():Promise<HydratedDocument<T>[] | null>
    findOne(filter: FilterQuery<T>): Promise<HydratedDocument<T> | null>
    update(id: string, update: UpdateQuery<T>): Promise<HydratedDocument<T> | null>
    delete(id: string): Promise<HydratedDocument<T> | null>
}