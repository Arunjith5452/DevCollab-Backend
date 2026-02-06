
import { injectable } from "inversify";
import { ICacheService } from "@/application/interface/cache.service.interface";
import { redisClient } from "./redis-client";

@injectable()
export class RedisService implements ICacheService {
    async get(key: string): Promise<string | null> {
        return await redisClient.get(key);
    }

    async set(key: string, value: string, mode?: string, duration?: number): Promise<string | null> {
        if (mode && duration) {
            // @ts-ignore - types mismatch with ioredis overloads but valid at runtime
            return await redisClient.set(key, value, mode, duration);
        }
        return await redisClient.set(key, value);
    }

    async del(key: string): Promise<number> {
        return await redisClient.del(key);
    }
}
