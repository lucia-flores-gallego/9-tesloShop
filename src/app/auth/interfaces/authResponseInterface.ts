import { User } from './userInterface';

export interface AuthResponse {
    user:  User;
    token: string;
}

