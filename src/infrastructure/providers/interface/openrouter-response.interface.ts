export interface OpenRouterMessage {
    content: string;
}

export interface OpenRouterChoice {
    message: OpenRouterMessage;
}

export interface OpenRouterResponse {
    choices: OpenRouterChoice[];
}
