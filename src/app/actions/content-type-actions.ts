'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const fieldSchema = z.object({
  label: z.string().min(3, "La etiqueta es requerida."),
  apiIdentifier: z.string(),
  type: z.enum(["TEXT", "RICH_TEXT", "NUMBER", "BOOLEAN", "DATE", "MEDIA"]),
  isRequired: z.boolean(),
});

const contentTypeSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  apiIdentifier: z.string().min(3, "El identificador API es requerido."),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, "Debes añadir al menos un campo."),
});

type ContentTypeFormValues = z.infer<typeof contentTypeSchema>;

export async function createContentTypeAction(data: ContentTypeFormValues) {
    const validatedFields = contentTypeSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error de validación. Revisa los campos.",
        };
    }

    const { name, apiIdentifier, description, fields } = validatedFields.data;

    try {
        await prisma.contentType.create({
            data: {
                name,
                apiIdentifier,
                description,
                fields: {
                    create: fields.map(field => ({
                        label: field.label,
                        apiIdentifier: field.apiIdentifier,
                        type: field.type,
                        isRequired: field.isRequired,
                    })),
                },
            },
        });

        revalidatePath('/admin/dashboard'); // O una ruta más específica si la hay
        return { success: true, message: "¡Tipo de contenido creado exitosamente!" };

    } catch (error) {
        console.error("Error al crear el tipo de contenido:", error);
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
             return { success: false, message: "Error: El Identificador API ya existe. Por favor, elige un nombre único." };
        }
        return { success: false, message: "Error del servidor: No se pudo crear el tipo de contenido." };
    }
}

export async function updateContentTypeAction(id: string, data: ContentTypeFormValues) {
    const validatedFields = contentTypeSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error de validación. Revisa los campos.",
        };
    }

    const { name, apiIdentifier, description, fields } = validatedFields.data;

    try {
        // Obtenemos los campos existentes en la base de datos para este tipo de contenido
        const existingFields = await prisma.field.findMany({
            where: { contentTypeId: id },
            select: { id: true },
        });
        const existingFieldIds = new Set(existingFields.map(f => f.id));
        const incomingFieldIds = new Set(fields.map((f: any) => f.id).filter(Boolean));

        // Transacción para asegurar que todas las operaciones se completen o ninguna
        await prisma.$transaction(async (tx) => {
            // 1. Actualizar los datos principales del tipo de contenido
            await tx.contentType.update({
                where: { id },
                data: {
                    name,
                    apiIdentifier,
                    description,
                },
            });

            // 2. Identificar y eliminar los campos que ya no existen
            const fieldsToDelete = Array.from(existingFieldIds).filter(fieldId => !incomingFieldIds.has(fieldId));
            if (fieldsToDelete.length > 0) {
                await tx.field.deleteMany({
                    where: { id: { in: fieldsToDelete } },
                });
            }

            // 3. Actualizar los campos existentes y crear los nuevos
            for (const fieldData of fields) {
                const fieldWithId = fieldData as any; // Tipo temporal para acceder a id
                if (fieldWithId.id && existingFieldIds.has(fieldWithId.id)) {
                    // Actualizar campo existente
                    await tx.field.update({
                        where: { id: fieldWithId.id },
                        data: {
                            label: fieldData.label,
                            apiIdentifier: fieldData.apiIdentifier,
                            type: fieldData.type,
                            isRequired: fieldData.isRequired,
                        },
                    });
                } else {
                    // Crear campo nuevo
                    await tx.field.create({
                        data: {
                            contentTypeId: id,
                            label: fieldData.label,
                            apiIdentifier: fieldData.apiIdentifier,
                            type: fieldData.type,
                            isRequired: fieldData.isRequired,
                        },
                    });
                }
            }
        });

        revalidatePath('/admin/dashboard/view-content');
        revalidatePath(`/admin/dashboard/content-types/edit/${id}`);
        return { success: true, message: "¡Estructura actualizada exitosamente!" };

    } catch (error) {
        console.error("Error al actualizar el tipo de contenido:", error);
        return { success: false, message: "Error del servidor: No se pudo actualizar la estructura." };
    }
} 
