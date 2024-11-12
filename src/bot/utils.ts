export function extractUserIdFromText(text?: string): string | null {
    const match = text?.match(/ID\s+(\d+):/);
    return match ? match[1] : null;
}

export function extractUserIdFromReply(replyText?: string): string | null {
    const match = replyText?.match(/ID пользователя:\s+(\d+)/);
    return match ? match[1] : null;
}
