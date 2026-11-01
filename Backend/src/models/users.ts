export interface User {
    email: string;
    password: string;
    name: string;
    organization: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
            apiKey: string;
        }
    }
}

export { };

export interface apiKeyDTO {
    id: string;
    user_id: string;
    name: string;
    created_at: Date;
    expires_at: Date|null;
    revoked_at: Date|null;
    last_used_at: Date|null;
}