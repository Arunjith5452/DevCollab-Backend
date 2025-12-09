export interface IBaseMapper<T, D> {
    toMongo(entity: T): D;
    fromMongo(doc: D): Promise<T>;
}
