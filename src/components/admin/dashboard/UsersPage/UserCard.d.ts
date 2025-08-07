import type { User as UserType } from '@/types/user';
interface UserCardProps {
    user: UserType;
    index: number;
    onViewDetails: (user: UserType) => void;
}
export declare function UserCard({ user, index, onViewDetails }: UserCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=UserCard.d.ts.map