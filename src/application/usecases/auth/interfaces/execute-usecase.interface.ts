export interface IExecute<T,S>{
    execute(dto:T):Promise<S>
}