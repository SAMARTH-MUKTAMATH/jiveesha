/**
 * Generate a random 8-character alphanumeric token
 * Format: XXXX-XXXX (e.g., AB12-CD34)
 */
export function generateConsentToken(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars (0, O, I, 1)
    let token = '';

    for (let i = 0; i < 8; i++) {
        if (i === 4) {
            token += '-'; // Add separator
        }
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex];
    }

    return token;
}

/**
 * Validate token format
 */
export function isValidTokenFormat(token: string): boolean {
    const pattern = /^[A-Z2-9]{4}-[A-Z2-9]{4}$/;
    return pattern.test(token);
}

/**
 * Generate unique token (checks database)
 */
export async function generateUniqueConsentToken(prisma: any): Promise<string> {
    let token = generateConsentToken();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure token is unique
    while (attempts < maxAttempts) {
        const existing = await prisma.consentGrant.findUnique({
            where: { token }
        });

        if (!existing) {
            return token;
        }

        token = generateConsentToken();
        attempts++;
    }

    throw new Error('Failed to generate unique token');
}
