import { injectable } from "inversify";

@injectable()
export class GitHubService {
    async createRepository(accessToken: string, name: string, description?: string): Promise<string> {
        try {
            const response = await fetch("https://api.github.com/user/repos", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "Accept": "application/vnd.github.v3+json"
                },
                body: JSON.stringify({
                    name,
                    description,
                    private: false, // Default to public, or could be passed as arg
                    auto_init: true
                })
            });

            if (!response.ok) {
                const errorData = await response.json() as any;
                throw new Error(errorData.message || "Failed to create GitHub repository");
            }

            const data = await response.json() as any;
            return data.html_url;
        } catch (error) {
            console.error("GitHub API Error:", error);
            throw error;
        }
    }
}
