import type { User, UserRole } from '@/types/user';
export interface UserStats {
    total: number;
    growthRate: number;
    activeUsers: number;
    activeSessionsCount: number;
    newUsersThisMonth: number;
}
export interface UserWithSessions extends User {
    sessions: UserSession[];
}
export interface UserSession {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
}
export declare const adminService: {
    getUserStats: () => Promise<UserStats>;
    getActiveSessions: () => Promise<never[]>;
    listUsers: () => Promise<User[]>;
    searchUsers: (searchTerm: string) => Promise<User[]>;
    getUserById: (userId: string) => Promise<User | null>;
    updateUserRole: (userId: string, role: UserRole) => Promise<unknown>;
    deleteUser: (userId: string) => Promise<boolean>;
    banUser: (userId: string, reason?: string) => Promise<unknown>;
    unbanUser: (userId: string) => Promise<unknown>;
    getUserSessions: (userId: string) => Promise<UserSession[]>;
    revokeSession: (sessionToken: string) => Promise<boolean>;
    revokeAllSessions: (userId: string) => Promise<boolean>;
    impersonateUser: (userId: string) => Promise<unknown>;
    stopImpersonating: () => Promise<boolean>;
};
//# sourceMappingURL=adminService.d.ts.map