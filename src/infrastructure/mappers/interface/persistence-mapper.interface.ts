export interface IPersistenceMapper<TEntity, TDocument> {
    toMongo(entity: TEntity): Partial<TDocument> | TDocument;
    fromMongo(doc: TDocument): TEntity;
}
