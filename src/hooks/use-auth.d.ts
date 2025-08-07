import type { SessionData } from '@/types/user';
interface LoginFormData {
    email: string;
    password: string;
}
export declare function isAdminUser(session: SessionData | null): boolean;
export declare function useAuth(): {
    isLoading: boolean;
    handleAuth: (formData: LoginFormData) => Promise<void>;
    handleLogout: () => Promise<void>;
};
export {};
//# sourceMappingURL=use-auth.d.ts.map