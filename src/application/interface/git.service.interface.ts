
export interface IGitHubService {
    createRepository(accessToken: string, name: string, description?: string): Promise<string>;
}
