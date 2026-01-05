import { Request, Response, NextFunction } from 'express';
import { toCamelCase } from '../utils/case-transformer';

/**
 * Middleware to automatically transform all API responses to camelCase
 * Intercepts res.json() calls and transforms the data
 */
export const responseTransformer = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Store the original json function
    const originalJson = res.json.bind(res);

    // Override res.json to transform data before sending
    res.json = function (body: any) {
        // Transform the response body to camelCase
        const transformedBody = toCamelCase(body);

        // Call the original json function with transformed data
        return originalJson(transformedBody);
    };

    next();
};
