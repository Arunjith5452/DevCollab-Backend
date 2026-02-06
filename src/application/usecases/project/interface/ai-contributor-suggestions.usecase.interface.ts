
export interface AiSuggestionResult {
    suggestions: { id: string; score: number; reason: string }[];
    source: 'ai' | 'heuristic';
}

// Interface for what the repository actually returns when populated
export interface PopulatedUser {
    name: string;
    bio?: string;
}
