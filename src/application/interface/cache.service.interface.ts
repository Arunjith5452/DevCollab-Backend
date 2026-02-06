
export interface ICacheService {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, mode?: string, duration?: number): Promise<string | null>;
    del(key: string): Promise<number>;
}
