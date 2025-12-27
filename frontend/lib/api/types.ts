// lib/api/types.ts

export interface User {
    id: number;
    username: string;
    email: string;
    reputation_stars: number;
    created_at: string;
    updated_at?: string;
}

export interface Tag {
    id: number;
    name: string;
    created_at?: string;
}

export interface Snippet {
    id: number;
    title: string;
    code: string;
    language: string;
    description?: string;
    tags: Tag[];
    author: User;
    likes_count: number;
    is_liked: boolean;
    created_at: string;
    updated_at: string;
    // For preview purposes in lists
    code_preview?: string;
}

export interface SnippetCreate {
    title: string;
    code: string;
    language: string;
    description?: string;
    tags: string[];
}

export interface SnippetUpdate {
    title?: string;
    code?: string;
    language?: string;
    description?: string;
    tags?: string[];
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface ErrorResponse {
    detail: string | Array<{
        loc: string[];
        msg: string;
        type: string;
    }>;
}