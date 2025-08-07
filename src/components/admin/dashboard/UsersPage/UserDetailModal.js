'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, Shield, Activity, Crown, Edit, Trash2, Ban, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
export function UserDetailModal({ user, isOpen, onClose, onUpdateRole, onDeleteUser, onToggleBan, isFirstUser = false }) {
    const [isUpdating, setIsUpdating] = useState(false);
    if (!user)
        return null;
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
                return 'from-blue-500 to-blue-600';
            case 'editor':
                return 'from-emerald-500 to-emerald-600';
            case 'user':
                return 'from-slate-500 to-slate-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };
    const handleRoleUpdate = async (newRole) => {
        if (!onUpdateRole)
            return;
        // Proteger al primer usuario de perder privilegios de admin
        if (isFirstUser && newRole === 'USER') {
            alert('No se puede quitar el rol de admin al primer usuario del sistema por seguridad.');
            return;
        }
        setIsUpdating(true);
        try {
            await onUpdateRole(user.id, newRole);
            onClose();
        }
        catch (error) {
            console.error('Error updating role:', error);
        }
        finally {
            setIsUpdating(false);
        }
    };
    const handleDelete = async () => {
        if (!onDeleteUser)
            return;
        // Proteger al primer usuario (admin principal)
        if (isFirstUser) {
            alert('No se puede eliminar el primer usuario del sistema por seguridad.');
            return;
        }
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
            setIsUpdating(true);
            try {
                await onDeleteUser(user.id);
                onClose();
            }
            catch (error) {
                console.error('Error deleting user:', error);
            }
            finally {
                setIsUpdating(false);
            }
        }
    };
    const handleToggleBan = async () => {
        if (!onToggleBan)
            return;
        const shouldBan = !user.banned;
        const action = shouldBan ? 'banear' : 'desbanear';
        // Proteger al primer usuario de ser baneado
        if (isFirstUser && shouldBan) {
            alert('No se puede banear al primer usuario del sistema por seguridad.');
            return;
        }
        if (window.confirm(`¿Estás seguro de que quieres ${action} a este usuario?`)) {
            setIsUpdating(true);
            try {
                await onToggleBan(user.id, shouldBan);
                onClose();
            }
            catch (error) {
                console.error('Error toggling ban:', error);
            }
            finally {
                setIsUpdating(false);
            }
        }
    };
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-white/10 dark:bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl max-w-2xl w-full overflow-hidden", children: [_jsxs("div", { className: "relative p-8 pb-6", children: [_jsx("button", { onClick: onClose, className: "absolute top-6 right-6 p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-xl transition-colors duration-200", children: _jsx(X, { className: "h-5 w-5 text-gray-700 dark:text-gray-300" }) }), _jsx("h2", { className: "text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-slate-700 dark:from-white dark:via-blue-400 dark:to-slate-300 bg-clip-text text-transparent", children: "Detalles del Usuario" })] }), _jsxs("div", { className: "px-8 pb-8 space-y-6", children: [_jsx("div", { className: "bg-white/40 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg bg-gradient-to-br", getRoleColor(user.role)), children: getInitials(user.name || 'Usuario') }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: user.name || 'Sin nombre' }), user.role === 'ADMIN' && (_jsxs("div", { className: "flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium", children: [_jsx(Crown, { className: "w-3 h-3" }), "Admin"] })), user.banned && (_jsxs("div", { className: "flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium", children: [_jsx(Ban, { className: "w-3 h-3" }), "Baneado"] }))] }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Mail, { className: "w-4 h-4 text-gray-500 dark:text-gray-400" }), _jsx("span", { className: "text-gray-700 dark:text-gray-300", children: user.email }), user.emailVerified ? (_jsx(CheckCircle, { className: "w-4 h-4 text-emerald-500" })) : (_jsx(XCircle, { className: "w-4 h-4 text-red-500" }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-gray-500 dark:text-gray-400" }), _jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Registrado: ", user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Fecha no disponible'] })] })] })] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-white/40 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 text-center", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3", children: _jsx(Activity, { className: "w-6 h-6 text-white" }) }), _jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white mb-1", children: user.emailVerified ? 'Verificado' : 'Sin verificar' }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Estado del email" })] }), _jsxs("div", { className: "bg-white/40 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 text-center", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3", children: _jsx(Shield, { className: "w-6 h-6 text-white" }) }), _jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white mb-1 capitalize", children: user.role?.toLowerCase() || 'Usuario' }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Rol del usuario" })] })] }), user.banned && (_jsxs("div", { className: "bg-red-50/50 dark:bg-red-900/20 backdrop-blur-lg rounded-2xl p-6 border border-red-200/50 dark:border-red-700/50", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Ban, { className: "w-5 h-5 text-red-600 dark:text-red-400" }), _jsx("span", { className: "text-lg font-bold text-red-700 dark:text-red-300", children: "Usuario Baneado" })] }), user.banReason && (_jsxs("p", { className: "text-gray-700 dark:text-gray-300 mb-2", children: ["Raz\u00F3n: ", user.banReason] })), user.banExpires && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-gray-500 dark:text-gray-400" }), _jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Expira: ", new Date(user.banExpires).toLocaleDateString()] })] }))] })), _jsxs("div", { className: "space-y-3 pt-6 border-t border-gray-200/50 dark:border-gray-700/50", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs(Button, { onClick: () => handleRoleUpdate(user.role === 'ADMIN' ? 'USER' : 'ADMIN'), disabled: isUpdating || (isFirstUser && user.role === 'ADMIN'), className: `rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 ${isFirstUser && user.role === 'ADMIN'
                                                    ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-500/90 hover:bg-blue-600 text-white'}`, children: [_jsx(Edit, { className: "w-4 h-4 mr-2" }), isFirstUser && user.role === 'ADMIN' ? 'Admin protegido' : (user.role === 'ADMIN' ? 'Quitar Admin' : 'Hacer Admin')] }), _jsxs(Button, { onClick: handleToggleBan, disabled: isUpdating || isFirstUser, variant: "outline", className: `rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 ${isFirstUser
                                                    ? 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                                    : 'border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`, children: [_jsx(Ban, { className: "w-4 h-4 mr-2" }), isFirstUser ? 'Usuario protegido' : (user.banned ? 'Desbanear' : 'Banear')] })] }), _jsxs(Button, { onClick: handleDelete, disabled: isUpdating || isFirstUser, variant: "outline", className: `w-full rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 ${isFirstUser
                                            ? 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                            : 'border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}`, children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), isFirstUser ? 'Usuario protegido' : 'Eliminar Usuario'] })] })] })] })] }));
}
//# sourceMappingURL=UserDetailModal.js.map