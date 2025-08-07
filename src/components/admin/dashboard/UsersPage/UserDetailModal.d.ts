import type { User as UserType } from '@/types/user';
interface UserDetailModalProps {
    user: UserType | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateRole?: (userId: string, role: 'ADMIN' | 'USER') => Promise<void>;
    onDeleteUser?: (userId: string) => Promise<void>;
    onToggleBan?: (userId: string, shouldBan: boolean) => Promise<void>;
    isFirstUser?: boolean;
}
export declare function UserDetailModal({ user, isOpen, onClose, onUpdateRole, onDeleteUser, onToggleBan, isFirstUser }: UserDetailModalProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=UserDetailModal.d.ts.map