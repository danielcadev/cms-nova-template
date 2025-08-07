'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Sidebar } from './dashboard/Sidebar';
export function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    return (_jsxs("div", { className: "min-h-screen flex relative overflow-hidden bg-ios-gray-1", children: [_jsxs("div", { className: "fixed inset-0 -z-10", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-ios-gray-1 via-white/60 to-ios-gray-1/80" }), _jsx("div", { className: "absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-ios-primary/8 to-transparent rounded-full blur-3xl animate-pulse opacity-60" }), _jsx("div", { className: "absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-ios-secondary/6 to-transparent rounded-full blur-3xl animate-pulse opacity-40", style: { animationDelay: '2s' } }), _jsx("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-ios-success/5 to-transparent rounded-full blur-2xl animate-pulse opacity-30", style: { animationDelay: '4s' } })] }), _jsx(Sidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false), onToggle: toggleSidebar }), _jsx("div", { className: "flex-1 flex flex-col min-h-screen relative", children: _jsx("main", { className: "flex-1 relative", children: _jsx("div", { className: "h-full", children: _jsx("div", { className: "transition-all duration-300 ease-out", children: children }) }) }) })] }));
}
//# sourceMappingURL=AdminLayout.js.map