'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ContentType {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string | null;
  fields: Field[];
  entries: ContentEntry[];
}

interface Field {
  id: string;
  label: string;
  apiIdentifier: string;
  type: string;
  isRequired: boolean;
}

interface ContentEntry {
  id: string;
  data: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentEntriesPageProps {
  contentType: ContentType;
}

export function ContentEntriesPage({ contentType }: ContentEntriesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const filteredEntries = contentType.entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      Object.values(entry.data).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getDisplayValue = (entry: ContentEntry, field: Field) => {
    const value = entry.data[field.apiIdentifier];
    if (!value) return '-';
    
    if (field.type === 'RICH_TEXT') {
      // Extraer texto plano del HTML
      const div = document.createElement('div');
      div.innerHTML = value;
      return div.textContent?.slice(0, 100) + '...' || '-';
    }
    
    if (field.type === 'MEDIA') {
      return value.url ? '📷 Imagen' : '-';
    }
    
    if (field.type === 'BOOLEAN') {
      return value ? '✅' : '❌';
    }
    
    if (field.type === 'DATE') {
      return new Date(value).toLocaleDateString();
    }
    
    return String(value).slice(0, 50) + (String(value).length > 50 ? '...' : '');
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta entrada?')) return;
    
    try {
      const response = await fetch(`/api/content-types/${contentType.apiIdentifier}/entries/${entryId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                  {contentType.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {contentType.description || `Gestiona las entradas de ${contentType.name}`}
                </p>
              </div>
              
              <Link href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/create`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear {contentType.name}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {contentType.entries.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="text-2xl font-semibold text-emerald-600">
                  {contentType.entries.filter(e => e.status === 'published').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Publicadas</div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="text-2xl font-semibold text-yellow-600">
                  {contentType.entries.filter(e => e.status === 'draft').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Borradores</div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <div className="text-2xl font-semibold text-gray-600">
                  {contentType.entries.filter(e => e.status === 'archived').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Archivadas</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar entradas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Todos los estados</option>
                <option value="published">Publicadas</option>
                <option value="draft">Borradores</option>
                <option value="archived">Archivadas</option>
              </select>
            </div>
          </div>

          {/* Content Table */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No hay entradas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Comienza creando tu primera entrada de {contentType.name}
                </p>
                <Link href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/create`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear {contentType.name}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {contentType.fields.slice(0, 3).map(field => (
                        <th key={field.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {field.label}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actualizado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredEntries.map(entry => (
                      <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        {contentType.fields.slice(0, 3).map(field => (
                          <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {getDisplayValue(entry, field)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            entry.status === 'published' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : entry.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {entry.status === 'published' ? 'Publicada' : 
                             entry.status === 'draft' ? 'Borrador' : 'Archivada'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(entry.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/edit/${entry.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(entry.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}