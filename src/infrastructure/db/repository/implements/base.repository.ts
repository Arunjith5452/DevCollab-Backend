import { Model, UpdateQuery, FilterQuery } from "mongoose";
import { IBaseRepository } from "../interface/base-repository.interface";

export abstract class BaseRepository<T> implements IBaseRepository<T> {

  constructor(protected readonly model: Model<T>) { }

  async create(item: Partial<T>): Promise<T> {
    return await this.model.create(item);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findAll(): Promise<T[]> {
    const result = await this.model.find({});
    return result || [];
  }

  async update(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<void> {
    await this.model.updateOne(filter, update);
  }

  async find(filter: FilterQuery<T>, options: { skip: number; limit: number }): Promise<T[]> {
    const docs = await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
      .exec();

    return docs as unknown as T[];  
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments(filter);
  }
}
