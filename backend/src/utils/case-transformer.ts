/**
 * Case Transformation Utilities
 * Converts between snake_case (database) and camelCase (frontend)
 */

/**
 * Convert snake_case object to camelCase
 * Handles nested objects and arrays recursively
 */
export function toCamelCase<T = any>(obj: any): T {
    // Handle null/undefined
    if (obj === null || obj === undefined) {
        return obj;
    }

    // Handle Date objects - convert to ISO string
    if (obj instanceof Date) {
        return obj.toISOString() as any;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => toCamelCase(item)) as any;
    }

    // Handle objects
    if (typeof obj === 'object' && obj.constructor === Object) {
        const result: any = {};

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // Convert key from snake_case to camelCase
                const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
                    letter.toUpperCase()
                );

                // Recursively transform the value
                result[camelKey] = toCamelCase(obj[key]);
            }
        }

        return result as T;
    }

    // Primitives - return as-is
    return obj;
}

/**
 * Convert camelCase object to snake_case
 * Handles nested objects and arrays recursively
 */
export function toSnakeCase(obj: any): any {
    // Handle null/undefined
    if (obj === null || obj === undefined) {
        return obj;
    }

    // Handle Date objects
    if (obj instanceof Date) {
        return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => toSnakeCase(item));
    }

    // Handle objects
    if (typeof obj === 'object' && obj.constructor === Object) {
        const result: any = {};

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // Convert key from camelCase to snake_case
                const snakeKey = key.replace(/[A-Z]/g, letter =>
                    `_${letter.toLowerCase()}`
                );

                // Recursively transform the value
                result[snakeKey] = toSnakeCase(obj[key]);
            }
        }

        return result;
    }

    // Primitives - return as-is
    return obj;
}

/**
 * Parse JSON string fields and transform keys
 * Useful for Prisma fields that store JSON as strings
 */
export function parseAndTransformJSON(jsonString: string | null): any {
    if (!jsonString) return null;

    try {
        const parsed = JSON.parse(jsonString);
        return toCamelCase(parsed);
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        return null;
    }
}

/**
 * Stringify object with snake_case keys for JSON fields
 */
export function transformAndStringifyJSON(obj: any): string {
    if (!obj) return '{}';

    try {
        const snakeCaseObj = toSnakeCase(obj);
        return JSON.stringify(snakeCaseObj);
    } catch (error) {
        console.error('Failed to stringify JSON:', error);
        return '{}';
    }
}
