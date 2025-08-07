'use client';

/**
 * NOVA CMS - CONTENT ENTRY LIST
 * ==============================
 * 
 * Lista de entradas de contenido para un ContentType específico.
 * Permite ver, editar y eliminar entradas del headless CMS.
 * 
 * CARACTERÍSTICAS:
 * - Vista de tabla/grid responsiva
 * - Filtrado y búsqueda
 * - Acciones CRUD (Create, Read, Update, Delete)
 * - Paginación
 * - Vista previa de contenido
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentEntry {
  id: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  contentType: {
    id: string;
    name: string;
    apiIdentifier: string;
    fields: Array<{
      id: string;
      label: string;
      apiIdentifier: string;
      type: string;
    }>;
  };
}

interface ContentEntryListProps {
  contentTypeId: string;
  onCreateNew?: () => void;
  onEdit?: (entryId: string) => void;
  onView?: (entryId: string) => void;
  onDelete?: (entryId: string) => void;
}

export function ContentEntryList({
  contentTypeId,
  onCreateNew,
  onEdit,
  onView,
  onDelete
}: ContentEntryListProps) {
  const { toast } = useToast();
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [contentType, setContentType] = useState<any>(null);

  useEffect(() => {
    fetchEntries();
  }, [contentTypeId]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/content/${contentTypeId}/entries`);
      const data = await response.json();
      
      if (response.ok) {
        setEntries(data.entries || []);
        setContentType(data.contentType);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar las entradas.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error de conexión.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      return;
    }

    try {
      const response = await fetch(`/api/content/entries/${entryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEntries(entries.filter(entry => entry.id !== entryId));
        toast({
          title: 'Eliminado',
          description: 'La entrada se eliminó exitosamente.',
        });
        if (onDelete) onDelete(entryId);
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la entrada.',
      });
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (!searchTerm) return true;
    
    // Buscar en todos los campos de datos
    const searchContent = Object.values(entry.data).join(' ').toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  const formatFieldValue = (value: any, fieldType: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (fieldType) {
      case 'BOOLEAN':
        return value ? '✅ Sí' : '❌ No';
      case 'DATE':
        return new Date(value).toLocaleDateString();
      case 'NUMBER':
        return value.toLocaleString();
      case 'MEDIA':
        return value ? '🖼️ Media' : '-';
      default:
        return String(value).length > 50 
          ? String(value).substring(0, 50) + '...'
          : String(value);
    }
  };

  const getDisplayFields = () => {
    if (!contentType?.fields) return [];
    // Mostrar máximo 3 campos principales en la tabla
    return contentType.fields.slice(0, 3);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {contentType?.name || 'Contenido'}
          </h2>
          <p className="text-gray-600">
            {entries.length} entradas encontradas
          </p>
        </div>
        <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Crear Nueva Entrada
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar en el contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <Card>
        <CardContent className="p-0">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay contenido
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'No se encontraron entradas que coincidan con tu búsqueda.' 
                  : 'Aún no se ha creado contenido de este tipo.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={onCreateNew} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primera entrada
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {getDisplayFields().map((field: any) => (
                    <TableHead key={field.id}>{field.label}</TableHead>
                  ))}
                  <TableHead className="w-24">
                    <Calendar className="h-4 w-4" />
                  </TableHead>
                  <TableHead className="w-16">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    {getDisplayFields().map((field: any) => (
                      <TableCell key={field.id}>
                        {formatFieldValue(
                          entry.data[field.apiIdentifier],
                          field.type
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView?.(entry.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit?.(entry.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
