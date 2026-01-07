// API Response wrappers
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: string[];
    };
}

export interface PaginatedResponse<T> {
    success: true;
    data: {
        items: T[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            total_pages: number;
        };
    };
}

// Common parameter types
export interface IdParam {
    id: string;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}
