import type { User, UserRole } from '@/types/user';
export declare function useUsers(): {
    users: User[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: import("react").Dispatch<import("react").SetStateAction<string>>;
    roleFilter: UserRole | "all";
    setRoleFilter: import("react").Dispatch<import("react").SetStateAction<UserRole | "all">>;
    filteredUsers: User[];
    updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
    refreshUsers: () => Promise<void>;
};
//# sourceMappingURL=use-users.d.ts.map