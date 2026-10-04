export interface User {
    id?: string;
    email: string;
    name: string;
    fullName?: string;
    isActive?: boolean;
    roles?: string[];
}