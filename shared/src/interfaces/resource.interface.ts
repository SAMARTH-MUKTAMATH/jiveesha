export type ResourceType = 'article' | 'video' | 'activity' | 'worksheet' | 'app' | 'book';
export type ResourceCategory = 'communication' | 'social_skills' | 'motor_development' | 'behavioral' | 'academic' | 'sensory' | 'daily_living';
export type ResourceDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Resource {
    id: string;
    title: string;
    description: string;
    resourceType: ResourceType;
    contentUrl?: string;
    thumbnailUrl?: string;
    fileUrl?: string;
    category: ResourceCategory;
    ageRange: string;
    tags: string[];
    difficulty?: ResourceDifficulty;
    views: number;
    favorites: number;
    author?: string;
    sourceUrl?: string;
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateResourceData {
    title: string;
    description: string;
    resourceType: ResourceType;
    contentUrl?: string;
    thumbnailUrl?: string;
    fileUrl?: string;
    category: ResourceCategory;
    ageRange: string;
    tags?: string[];
    difficulty?: ResourceDifficulty;
    author?: string;
    sourceUrl?: string;
}

export interface UpdateResourceData {
    title?: string;
    description?: string;
    resourceType?: ResourceType;
    contentUrl?: string;
    thumbnailUrl?: string;
    fileUrl?: string;
    category?: ResourceCategory;
    ageRange?: string;
    tags?: string[];
    difficulty?: ResourceDifficulty;
    author?: string;
    sourceUrl?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
}

export interface ResourceFilters {
    resourceType?: ResourceType;
    category?: ResourceCategory;
    ageRange?: string;
    difficulty?: ResourceDifficulty;
    tags?: string[];
    searchQuery?: string;
    isFeatured?: boolean;
}

export interface ResourceWithStats extends Resource {
    isFavorited?: boolean;
}
