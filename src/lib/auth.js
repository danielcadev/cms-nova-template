// lib/auth.ts
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    secret: process.env.BETTER_AUTH_SECRET || process.env.ENCRYPTION_KEY,
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
//# sourceMappingURL=auth.js.map