export interface IBaseMapper<T>{
    toMongo(entity:T):any;
    fromMongo(doc:any):Promise<T>;
}