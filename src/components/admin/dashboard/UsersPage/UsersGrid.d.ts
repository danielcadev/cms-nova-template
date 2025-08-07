import type { User as UserType } from '@/types/user';
interface UsersGridProps {
    users: UserType[];
    loading: boolean;
    error: any;
    onViewDetails: (user: UserType) => void;
}
export declare function UsersGrid({ users, loading, error, onViewDetails }: UsersGridProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=UsersGrid.d.ts.map