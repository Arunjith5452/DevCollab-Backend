
export interface AiSuggestionResult {
    suggestions: { id: string; score: number; reason: string }[];
    source: 'ai' | 'heuristic';
}

export interface PopulatedUser {
    name: string;
    bio?: string;
}
