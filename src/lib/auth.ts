// lib/auth.ts
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// Generar un secret por defecto si no existe
const getAuthSecret = () => {
    const secret = process.env.BETTER_AUTH_SECRET;
    if (!secret) {
        console.warn('⚠️  BETTER_AUTH_SECRET no configurado, usando secret por defecto para desarrollo');
        return 'cms-nova-default-secret-change-in-production-' + Date.now();
    }
    return secret;
};

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    secret: getAuthSecret(),
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        admin({
            adminRoles: ["ADMIN", "admin", "Admin"],
        })
    ],
    databaseHooks: {
        user: {
            create: {
                before: async (userData) => {
                    // Contamos si ya existe algún usuario en la base de datos.
                    const userCount = await prisma.user.count();

                    // Si no hay usuarios, este es el primero, así que lo hacemos ADMIN.
                    if (userCount === 0) {
                        return {
                            data: {
                                ...userData,
                                role: 'ADMIN', // Añadimos el rol de ADMIN aquí.
                            }
                        };
                    }

                    // Para todos los demás, devolvemos los datos sin modificar.
                    return { data: userData };
                },
            }
        }
    },
});
