'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { UserPlus, RefreshCw } from 'lucide-react';
import { useUsers } from '@/hooks/use-users';
import { useToast } from '@/hooks/use-toast';
// Componentes modulares
import { UsersGrid } from './UsersGrid';
import { UserDetailModal } from './UserDetailModal';
export function UsersPage() {
    const { users, loading, updateUserRole, refreshUsers } = useUsers();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    // Filtrar usuarios
    const filteredUsers = users.filter(user => user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    // Estadísticas
    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        verified: users.filter(u => u.emailVerified).length,
        newThisMonth: users.filter(u => {
            if (!u.createdAt)
                return false;
            const userDate = new Date(u.createdAt);
            const now = new Date();
            return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
        }).length
    };
    // Determinar el primer usuario (el más antiguo)
    const firstUser = users.length > 0 ? users.reduce((oldest, current) => new Date(oldest.createdAt) < new Date(current.createdAt) ? oldest : current) : null;
    // Handlers
    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshUsers();
        setTimeout(() => setIsRefreshing(false), 1000);
    };
    const handleUpdateRole = async (userId, role) => {
        try {
            await updateUserRole(userId, role);
            await refreshUsers();
            toast({
                title: "Éxito",
                description: "Rol actualizado correctamente"
            });
        }
        catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar el rol",
                variant: "destructive"
            });
        }
    };
    const handleDeleteUser = async (userId) => {
        toast({
            title: "Función no disponible",
            description: "La eliminación de usuarios estará disponible próximamente",
            variant: "destructive"
        });
    };
    const handleToggleBan = async (userId, shouldBan) => {
        toast({
            title: "Función no disponible",
            description: "El baneo de usuarios estará disponible próximamente",
            variant: "destructive"
        });
    };
    // Loading state
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950", children: _jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-center text-sm", children: "Cargando usuarios..." })] }) }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" }), _jsx("div", { className: "relative z-10 p-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("div", { className: "mb-16", children: _jsxs("div", { className: "flex items-start justify-between mb-12", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-4xl lg:text-5xl font-medium text-gray-900 dark:text-gray-100 tracking-tight leading-tight", children: "Gesti\u00F3n de usuarios" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide", children: "Administra usuarios, roles y permisos del sistema" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: handleRefresh, disabled: isRefreshing, className: "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(RefreshCw, { className: `h-4 w-4 transition-transform duration-200 ${isRefreshing ? 'animate-spin' : ''}`, strokeWidth: 1.5 }), isRefreshing ? 'Actualizando...' : 'Actualizar'] }) }), _jsx("button", { className: "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(UserPlus, { className: "h-4 w-4", strokeWidth: 1.5 }), "Invitar usuario"] }) })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-16", children: [_jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full mt-2" }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight", children: stats.total }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400 font-medium", children: "Total usuarios" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "w-2 h-2 bg-slate-500 rounded-full mt-2" }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight", children: stats.admins }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400 font-medium", children: "Administradores" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "w-2 h-2 bg-emerald-500 rounded-full mt-2" }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight", children: stats.verified }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400 font-medium", children: "Verificados" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "w-2 h-2 bg-amber-500 rounded-full mt-2" }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight", children: stats.newThisMonth }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400 font-medium", children: "Nuevos este mes" })] })] }) })] }), _jsx("div", { className: "mb-8", children: _jsx(UsersGrid, { users: filteredUsers, loading: loading, error: null, onViewDetails: handleViewDetails }) }), _jsx(UserDetailModal, { user: selectedUser, isOpen: isModalOpen, onClose: handleCloseModal, onUpdateRole: handleUpdateRole, onDeleteUser: handleDeleteUser, onToggleBan: handleToggleBan, isFirstUser: selectedUser?.id === firstUser?.id })] }) })] }));
}
//# sourceMappingURL=index.js.map