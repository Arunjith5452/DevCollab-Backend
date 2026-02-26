import { Model, UpdateQuery, FilterQuery } from "mongoose";
import { IBaseRepository } from "@/domain/repository/base-repository.interface";
import { IPersistenceMapper } from "@/infrastructure/mappers/interface/persistence-mapper.interface";

export abstract class BaseRepository<TEntity, TDocument> implements IBaseRepository<TEntity> {

  constructor(
    protected readonly model: Model<TDocument>,
    protected readonly mapper: IPersistenceMapper<TEntity, TDocument>
  ) { }

  async create(item: TEntity): Promise<TEntity> {
    const mongoData = this.mapper.toMongo(item);
    const result = await this.model.create(mongoData);
    return this.mapper.fromMongo(result as unknown as TDocument);
  }

  async findById(id: string): Promise<TEntity | null> {
    const result = await this.model.findById(id);
    return result ? this.mapper.fromMongo(result as unknown as TDocument) : null;
  }

  async findAll(): Promise<TEntity[]> {
    const result = await this.model.find({});
    return result.map(doc => this.mapper.fromMongo(doc as unknown as TDocument));
  }

  async update(id: string, update: UpdateQuery<TEntity>): Promise<TEntity | null> {
    const result = await this.model.findByIdAndUpdate(id, update as unknown as UpdateQuery<TDocument>, { new: true });
    return result ? this.mapper.fromMongo(result as unknown as TDocument) : null;
  }

  async findOne(filter: FilterQuery<TEntity>): Promise<TEntity | null> {
    const result = await this.model.findOne(filter as unknown as FilterQuery<TDocument>);
    return result ? this.mapper.fromMongo(result as unknown as TDocument) : null;
  }

  async updateOne(filter: FilterQuery<TEntity>, update: UpdateQuery<TEntity>): Promise<void> {
    await this.model.updateOne(filter as unknown as FilterQuery<TDocument>, update as unknown as UpdateQuery<TDocument>);
  }

  async find(filter: FilterQuery<TEntity>, options: { skip: number; limit: number }): Promise<TEntity[]> {
    const docs = await this.model
      .find(filter as unknown as FilterQuery<TDocument>)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
      .exec();

    return docs.map(doc => this.mapper.fromMongo(doc as unknown as TDocument));
  }

  async delete(id: string): Promise<TEntity | null> {
    const result = await this.model.findByIdAndDelete(id);
    return result ? this.mapper.fromMongo(result as unknown as TDocument) : null;
  }

  async count(filter: FilterQuery<TEntity>): Promise<number> {
    return await this.model.countDocuments(filter as unknown as FilterQuery<TDocument>);
  }
}

