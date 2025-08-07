'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Users, UserPlus } from 'lucide-react';
import { UserCard } from './UserCard';
export function UsersGrid({ users, loading, error, onViewDetails }) {
    if (loading) {
        return _jsx(LoadingState, {});
    }
    if (error) {
        return _jsx(ErrorState, {});
    }
    if (users.length === 0) {
        return _jsx(EmptyState, {});
    }
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8", children: users.map((user, index) => (_jsx(UserCard, { user: user, index: index, onViewDetails: onViewDetails }, user.id))) }));
}
function LoadingState() {
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: [...Array(8)].map((_, i) => (_jsxs("div", { className: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 animate-pulse", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" }), _jsx("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" }), _jsx("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" }), _jsx("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" })] })] }, i))) }));
}
function ErrorState() {
    return (_jsx("div", { className: "text-center py-20 px-4", children: _jsxs("div", { className: "max-w-md mx-auto", children: [_jsx("div", { className: "w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-6", children: _jsx(Users, { className: "w-8 h-8 text-red-600 dark:text-red-400", strokeWidth: 1.5 }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight", children: "Error al cargar usuarios" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-8 leading-relaxed", children: "No se pudieron cargar los usuarios. Verifica tu conexi\u00F3n e intenta nuevamente." }), _jsx("button", { className: "bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200", children: "Reintentar" })] }) }));
}
function EmptyState() {
    return (_jsx("div", { className: "text-center py-20 px-4", children: _jsxs("div", { className: "max-w-md mx-auto", children: [_jsx("div", { className: "w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6", children: _jsx(Users, { className: "w-8 h-8 text-gray-500 dark:text-gray-400", strokeWidth: 1.5 }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight", children: "No hay usuarios" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-8 leading-relaxed", children: "A\u00FAn no hay usuarios registrados en el sistema. Los usuarios aparecer\u00E1n aqu\u00ED cuando se registren." }), _jsx("button", { className: "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(UserPlus, { className: "w-4 h-4", strokeWidth: 1.5 }), _jsx("span", { children: "Invitar usuario" })] }) })] }) }));
}
//# sourceMappingURL=UsersGrid.js.map