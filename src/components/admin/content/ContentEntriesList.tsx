import { PageLayout } from '@/components/admin/shared/PageLayout';
import { HeroSection } from '@/components/admin/shared/HeroSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, ArrowLeft, Database, Calendar, Edit, Eye, Sparkles, FileText, Clock } from 'lucide-react';

interface ContentType {
    id: string;
    name: string;
    description: string | null;
    apiIdentifier: string;
    fields: Array<{
        id: string;
        label: string;
    }>;
    entries: Array<{
        id: string;
        data: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

interface ContentEntriesListProps {
    contentType: ContentType;
}

export function ContentEntriesList({ contentType }: ContentEntriesListProps) {
    return (
        <>
            <PageLayout 
                backgroundVariant="green"
                showDate={false}
                backLink={{
                    href: "/admin/dashboard/view-content",
                    label: "Volver"
                }}
            >
                <HeroSection
                    badge={{
                        icon: Database,
                        title: contentType.name,
                        subtitle: "Entradas de Contenido",
                        color: "bg-gradient-to-r from-green-500/10 to-emerald-600/10"
                    }}
                    title={`Entradas de ${contentType.name}`}
                    description={contentType.description || `Gestiona y organiza todas las entradas de ${contentType.name.toLowerCase()}`}
                    stats={[
                        {
                            value: contentType.entries.length,
                            label: "Total de Entradas",
                            color: "text-green-600"
                        },
                        {
                            value: contentType.fields.length,
                            label: "Campos Configurados",
                            color: "text-blue-600"
                        },
                        {
                            value: contentType.entries.length > 0 
                                ? new Date(contentType.entries[0].updatedAt).toLocaleDateString('es-ES')
                                : 'Sin entradas',
                            label: "Última Actualización",
                            color: "text-purple-600"
                        }
                    ]}
                />
                
                {/* Botón de crear */}
                <div className="flex justify-end mt-8">
                    <Link href={`/admin/dashboard/content/${contentType.apiIdentifier}/create`}>
                        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-8 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
                            <PlusCircle className="h-5 w-5" />
                            <span className="font-semibold">Crear {contentType.name}</span>
                        </Button>
                    </Link>
                </div>
            </PageLayout>

            {/* Contenido principal */}
            <div className="container mx-auto px-8 py-12 max-w-7xl">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-lg">
                                <FileText className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Todas las Entradas
                                </h3>
                                <p className="text-gray-600">
                                    {contentType.entries.length} {contentType.entries.length === 1 ? 'entrada' : 'entradas'} en total
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8">
                        {contentType.entries.length > 0 ? (
                            <EntriesGrid contentType={contentType} />
                        ) : (
                            <EmptyState contentType={contentType} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function EntriesGrid({ contentType }: { contentType: ContentType }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentType.entries.map((entry, index) => (
                <EntryCard 
                    key={entry.id} 
                    entry={entry} 
                    contentType={contentType} 
                    index={index} 
                />
            ))}
        </div>
    );
}

function EntryCard({ entry, contentType, index }: { 
    entry: ContentType['entries'][0]; 
    contentType: ContentType; 
    index: number; 
}) {
    // Extraer título del JSON data o usar valor por defecto
    const entryData = entry.data as any;
    const title = entryData?.title || entryData?.name || entryData?.titulo || `Entrada #${entry.id.slice(-6)}`;
    
    return (
        <div 
            className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-white/50 overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Efecto de fondo al hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-sm font-semibold">
                        <Sparkles className="h-4 w-4" />
                        {contentType.name}
                    </div>
                </div>

                {/* Contenido */}
                <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors line-clamp-2">
                    {title}
                </h4>
                
                <p className="text-gray-600 mb-8 text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Creado el {new Date(entry.createdAt).toLocaleDateString('es-ES')}
                </p>

                {/* Acciones */}
                <div className="flex items-center gap-3">
                    <Link href={`/admin/dashboard/content/${contentType.apiIdentifier}/edit/${entry.id}`} className="flex-1">
                        <Button variant="outline" className="w-full rounded-2xl border-gray-200 hover:bg-gray-50 text-gray-700 py-3">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-50 rounded-2xl w-12 h-12">
                        <Eye className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ contentType }: { contentType: ContentType }) {
    return (
        <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mb-8">
                <PlusCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
                No hay entradas todavía
            </h3>
            <p className="text-gray-600 mb-10 text-lg leading-relaxed max-w-md mx-auto">
                Crea tu primera entrada de {contentType.name.toLowerCase()} para comenzar a organizar tu contenido.
            </p>
            <Link href={`/admin/dashboard/content/${contentType.apiIdentifier}/create`}>
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg">
                    <PlusCircle className="mr-3 h-6 w-6" />
                    Crear Primera Entrada
                </Button>
            </Link>
        </div>
    );
}
