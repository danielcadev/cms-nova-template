export type UserRole = 'ADMIN' | 'USER';
export type UserStatus = 'active' | 'inactive';
export interface BetterAuthUser {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    role?: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    banned: boolean | null;
    banReason?: string | null;
    banExpires?: Date | null;
}
export interface BetterAuthSession {
    user: BetterAuthUser;
}
export interface ErrorResponse {
    code?: string;
    message: string;
}
export interface SessionData {
    user: BetterAuthUser;
}
export interface BetterAuthResponse<T> {
    data: T | null;
    error: ErrorResponse | null;
}
export interface GetSessionResponse {
    data: SessionData | null;
    error: ErrorResponse | null;
}
export interface UsersResponse {
    users: BetterAuthUser[];
}
export interface UserResponse {
    user: BetterAuthUser;
}
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    status: UserStatus;
    banned?: boolean;
    banReason?: string;
    banExpires?: Date;
}
export interface UserUpdateParams {
    userId: string;
    role?: UserRole;
    status?: UserStatus;
}
export interface UsersTableProps {
    users: User[];
    onChangeRole: (userId: string, role: UserRole) => Promise<void>;
    onDeleteUser: (userId: string) => Promise<void>;
    onToggleBan: (userId: string, shouldBan: boolean) => Promise<void>;
    currentUserEmail?: string;
}
export interface UserQuery {
    filterField?: string;
    filterOperator?: 'eq' | 'contains' | 'starts_with' | 'ends_with';
    filterValue?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}
export interface BanUserParams {
    userId: string;
    banReason?: string;
    banExpiresIn?: number;
}
export interface UpdateRoleParams {
    userId: string;
    role: UserRole;
}
export interface CreateUserParams {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
}
export interface SuccessResponse {
    success: boolean;
    error?: ErrorResponse;
}
export interface SessionOptions {
    expiresIn?: number;
    updateAge?: number;
    freshAge?: number;
}
export interface SessionQuery {
    disableCookieCache?: boolean;
}
export interface ApiError extends Error {
    code?: string;
    status?: number;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export interface FilterParams {
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    startDate?: Date;
    endDate?: Date;
}
export interface SortParams {
    field: string;
    direction: 'asc' | 'desc';
}
export type WithRequired<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
//# sourceMappingURL=user.d.ts.map