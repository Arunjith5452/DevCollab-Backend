import { Model, UpdateQuery, FilterQuery, HydratedDocument } from "mongoose"
import { IBaseRepository } from "../interface/base-repository.interface";

export abstract class BaseRepository<T> implements IBaseRepository<T> {

    constructor(protected readonly model: Model<T>) {
    }
    async create(item: Partial<HydratedDocument<T>>): Promise<HydratedDocument<T>> {
        return await this.model.create(item)
    }

    async findById(id: string): Promise<HydratedDocument<T> | null> {
        return await this.model.findById(id)
    }

    async findAll(): Promise<HydratedDocument<T>[] | null> {
        return await this.model.find({});
    }

    async update(id: string, update: UpdateQuery<T>): Promise<HydratedDocument<T> | null> {
        return await this.model.findByIdAndUpdate(id, update, { new: true })
    }

    async findOne(filtered: FilterQuery<T>): Promise<HydratedDocument<T> | null> {
        return await this.model.findOne(filtered)
    }

    async delete(id: string): Promise<HydratedDocument<T> | null> {
        return await this.model.findByIdAndDelete(id)
    }
}