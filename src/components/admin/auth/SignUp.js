// components/admin/auth/SignUp.tsx - Notion Style Design
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Package, User, Mail, Lock, ArrowLeft } from 'lucide-react';
export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', email: '', password: '' };
        // Validar nombre
        if (!formData.name) {
            newErrors.name = 'El nombre es requerido';
            isValid = false;
        }
        // Validar email
        if (!formData.email) {
            newErrors.email = 'El email es requerido';
            isValid = false;
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
            isValid = false;
        }
        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
            isValid = false;
        }
        else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Limpiar error al cambiar el valor
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }
    };
    const signUp = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        await authClient.signUp.email({
            email: formData.email,
            password: formData.password,
            name: formData.name
        }, {
            onRequest: () => {
                setIsLoading(true);
            },
            onSuccess: () => {
                router.push('/admin/login');
            },
            onError: (ctx) => {
                alert(ctx.error.message);
            },
            onSettled: () => {
                setIsLoading(false);
            }
        });
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" }), _jsx("div", { className: "absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-green-500/8 to-transparent rounded-full blur-3xl animate-pulse opacity-60" }), _jsx("div", { className: "absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-blue-500/6 to-transparent rounded-full blur-3xl animate-pulse opacity-40", style: { animationDelay: '2s' } }), _jsx("div", { className: "relative z-10 flex min-h-screen items-center justify-center p-8", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsx("div", { className: "mb-8", children: _jsxs(Button, { variant: "ghost", onClick: () => router.push('/admin/login'), className: "flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors", children: [_jsx(ArrowLeft, { className: "h-4 w-4", strokeWidth: 1.5 }), _jsx("span", { className: "font-medium", children: "Volver al login" })] }) }), _jsxs("div", { className: "text-center mb-12", children: [_jsxs("div", { className: "flex items-center justify-center gap-3 mb-6", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900", children: _jsx(Package, { className: "h-6 w-6", strokeWidth: 2 }) }), _jsxs("div", { className: "text-left", children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight", children: "Nova CMS" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 font-medium", children: "Crear Cuenta de Administrador" })] })] }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 font-light", children: "Configura tu cuenta de administrador" })] }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm", children: _jsxs("form", { onSubmit: signUp, className: "space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { htmlFor: "name", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Nombre completo" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(User, { className: "h-4 w-4 text-gray-400", strokeWidth: 1.5 }) }), _jsx(Input, { id: "name", type: "text", placeholder: "Tu nombre completo", value: formData.name, onChange: handleChange, className: `pl-10 rounded-lg border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500 ${errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''}`, disabled: isLoading })] }), errors.name && (_jsx("p", { className: "text-sm text-red-500 dark:text-red-400", children: errors.name }))] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { htmlFor: "email", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Correo electr\u00F3nico" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-4 w-4 text-gray-400", strokeWidth: 1.5 }) }), _jsx(Input, { id: "email", type: "email", placeholder: "admin@example.com", value: formData.email, onChange: handleChange, className: `pl-10 rounded-lg border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500 ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''}`, disabled: isLoading })] }), errors.email && (_jsx("p", { className: "text-sm text-red-500 dark:text-red-400", children: errors.email }))] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { htmlFor: "password", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Contrase\u00F1a" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-4 w-4 text-gray-400", strokeWidth: 1.5 }) }), _jsx(Input, { id: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: formData.password, onChange: handleChange, className: `pl-10 rounded-lg border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500 ${errors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''}`, disabled: isLoading })] }), errors.password && (_jsx("p", { className: "text-sm text-red-500 dark:text-red-400", children: errors.password }))] }), _jsx(Button, { type: "submit", className: "w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Creando cuenta..."] })) : ('Crear cuenta de administrador') })] }) }), _jsx("div", { className: "text-center mt-8", children: _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u00BFYa tienes una cuenta?", ' ', _jsx("button", { onClick: () => router.push('/admin/login'), className: "text-gray-900 dark:text-gray-100 hover:underline font-medium", children: "Inicia sesi\u00F3n" })] }) })] }) })] }));
}
//# sourceMappingURL=SignUp.js.map