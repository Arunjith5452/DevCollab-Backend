import { ContainerModule } from "inversify";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { ICacheService } from "@/application/interface/cache.service.interface";
import { RedisService } from "@/infrastructure/providers/redis/redis.service";
import { IStorageService } from "@/application/interface/storage.service.interface";
import { StorageService } from "@/infrastructure/providers/s3-bucket/storage.service";
import { CloudinaryService } from "@/infrastructure/providers/cloudinary/cloudinary.service";
import { IGitHubService } from "@/application/interface/git.service.interface";
import { GitHubService } from "@/infrastructure/providers/git/github.service";

export const CommonModule = new ContainerModule(({ bind }) => {
    bind<ICacheService>(COMMON_TYPES.CacheService).to(RedisService).inSingletonScope();
    // bind<IStorageService>(COMMON_TYPES.StorageService).to(StorageService).inSingletonScope();
    bind<IStorageService>(COMMON_TYPES.StorageService).to(CloudinaryService).inSingletonScope();
    bind<IGitHubService>(COMMON_TYPES.GitHubService).to(GitHubService).inSingletonScope();
});
