import { UserDetail } from "./user-detail";

export class User {
    user_id?: number;
    email?: string;
    unique_id?: string;
    password?: string;
    role_id?: number;
    user_status?: string;
    created_date?: string;
    updated_date?: string;
    details?: UserDetail 
}