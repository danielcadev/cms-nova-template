'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MoreHorizontal, Crown, User, Edit, Calendar, Activity, Eye, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export function UserCard({ user, index, onViewDetails }) {
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };
    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-blue-600';
            case 'editor':
                return 'bg-emerald-600';
            case 'user':
                return 'bg-gray-600';
            default:
                return 'bg-gray-600';
        }
    };
    const getRoleIcon = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return Crown;
            case 'editor':
                return Edit;
            default:
                return User;
        }
    };
    const RoleIcon = getRoleIcon(user.role);
    return (_jsx("div", { className: "group cursor-pointer", style: { animationDelay: `${index * 100}ms` }, children: _jsxs("div", { className: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 hover:border-gray-300 dark:hover:border-gray-700", children: [_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: cn("w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-sm", getRoleColor(user.role)), children: getInitials(user.name || 'Usuario') }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight", children: user.name || 'Usuario sin nombre' }), _jsx("div", { className: cn("w-5 h-5 rounded flex items-center justify-center", getRoleColor(user.role)), children: _jsx(RoleIcon, { className: "w-3 h-3 text-white", strokeWidth: 1.5 }) })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: user.email || 'Email no disponible' })] })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0", children: _jsx(MoreHorizontal, { className: "h-4 w-4 text-gray-500", strokeWidth: 1.5 }) })] }), _jsxs("div", { className: "space-y-3 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-4 h-4 text-gray-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Rol" })] }), _jsx("div", { className: cn("px-2 py-1 rounded text-xs font-medium text-white", getRoleColor(user.role)), children: user.role?.toUpperCase() || 'USER' })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-gray-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Registro" })] }), _jsx("span", { className: "text-sm text-gray-900 dark:text-gray-100", children: user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    }) : 'N/A' })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "w-4 h-4 text-gray-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Estado" })] }), _jsx("div", { className: cn("w-2 h-2 rounded-full", user.emailVerified ? 'bg-emerald-500' : 'bg-red-500') })] })] }), _jsxs("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200", children: [_jsx("button", { onClick: () => onViewDetails(user), className: "flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-all duration-200", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(Eye, { className: "h-4 w-4", strokeWidth: 1.5 }), _jsx("span", { children: "Ver perfil" })] }) }), _jsx("button", { className: "px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200", children: _jsx(Mail, { className: "h-4 w-4", strokeWidth: 1.5 }) })] })] }) }));
}
//# sourceMappingURL=UserCard.js.map