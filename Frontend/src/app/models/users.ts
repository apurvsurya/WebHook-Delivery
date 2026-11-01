export interface CreateUserInput {

    "name": string;
    "email": string;
    "password": string;
    "organization": string;

}

export interface UserCreatedDTO {
    message: string;
    data: UserCreated
}

export interface UserCreated {
    id: string;
    email: string;
    name: string;
    organization: string;
    updated_at: Date;
}

export interface UserDTO {
    id: string;
    email: string;
    name: string;
    organization: string;
    lastUpdated: Date;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface LoginDTO {
    message: string;
    token: string;
    data: UserDTO;
}

export interface APIKeys {
    id: string;
    name: string;
    prefix: string;
    createdAt: Date;
}

export interface APIGeneratedDetails {
    user_id: string;
    revoked_at: Date | null;
    id: string;
    name: string;
    created_at: Date;
    expires_at: Date | null;
    last_used_at: Date | null;
}

export interface APIGeneratedDTO{
    message:string;
    details:APIGeneratedDetails;
    rawKey:string;
}