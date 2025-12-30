import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2, Save, List, Edit3, FileText, CheckCircle2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ManageOptionModalProps {
    type: 'region' | 'subRegion' | 'zone'
    parentName?: string
    onSave: (name: string) => Promise<void>
    trigger?: React.ReactNode
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
    customTitle?: string // Allow overriding the title
    initialValue?: string // Pre-fill name
}

export function ManageOptionModal({
    type,
    parentName,
    onSave,
    trigger,
    isOpen,
    onOpenChange,
    customTitle,
    initialValue
}: ManageOptionModalProps) {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [internalOpen, setInternalOpen] = useState(false)
    const [isBulkMode, setIsBulkMode] = useState(false)

    const isControlled = isOpen !== undefined
    const show = isControlled ? isOpen : internalOpen
    const setShow = isControlled ? onOpenChange! : setInternalOpen

    // Sync initialValue when modal opens
    useEffect(() => {
        if (show && initialValue) {
            setName(initialValue)
            // Auto-switch to bulk if it looks like a list
            if (initialValue.includes('\n') || initialValue.includes(',') || initialValue.includes('/')) {
                setIsBulkMode(true)
            }
        }
    }, [show, initialValue])

    const handleSave = async () => {
        if (!name.trim()) return
        setLoading(true)
        try {
            await onSave(name)
            setName('')
            setShow(false)
        } finally {
            setLoading(false)
        }
    }

    const typeLabels = {
        region: 'Región',
        subRegion: 'Subregión',
        zone: 'Ciudad / Zona / Municipio'
    }

    const itemCount = name.split(/[,\n\/]+/).filter(n => n.trim()).length

    return (
        <Dialog open={show} onOpenChange={setShow}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="bg-zinc-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold tracking-tight">
                                {customTitle || `Agregar ${typeLabels[type]}`}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 text-sm mt-1">
                                {parentName
                                    ? `Dentro de "${parentName}"`
                                    : 'Nueva ubicación principal'}
                            </DialogDescription>
                        </div>
                        <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-md">
                            <button
                                onClick={() => setIsBulkMode(false)}
                                className={`p-2 rounded-lg transition-all ${!isBulkMode ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                                title="Modo Individual"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsBulkMode(true)}
                                className={`p-2 rounded-lg transition-all ${isBulkMode ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                                title="Modo Lista (Bulk)"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <Label htmlFor="name" className="text-sm font-semibold text-zinc-600 flex items-center gap-2">
                                {isBulkMode ? <FileText className="w-4 h-4 text-zinc-400" /> : <Edit3 className="w-4 h-4 text-zinc-400" />}
                                {isBulkMode ? 'Lista de Nombres' : 'Nombre'}
                            </Label>
                            {isBulkMode && itemCount > 0 && (
                                <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    {itemCount} {itemCount === 1 ? 'item' : 'items'} detectados
                                </span>
                            )}
                        </div>

                        {isBulkMode ? (
                            <Textarea
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="min-h-[180px] bg-zinc-50/50 border-zinc-200 rounded-2xl focus:ring-zinc-900 focus:border-zinc-900 transition-all resize-none font-mono text-sm p-4 placeholder:text-zinc-400"
                                placeholder={`Ej:\nBogotá\nMedellín\nCali\nO sepáralos por comas...`}
                                autoFocus
                            />
                        ) : (
                            <div className="relative">
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-14 bg-zinc-50/50 border-zinc-200 rounded-2xl focus:ring-zinc-900 focus:border-zinc-900 transition-all px-5 text-lg font-medium placeholder:text-zinc-300"
                                    placeholder={`Ej: ${type === 'region' ? 'Caribe' : 'Cartagena'}`}
                                    autoFocus
                                />
                            </div>
                        )}

                        <p className="text-[11px] text-zinc-400 leading-relaxed px-1">
                            {isBulkMode
                                ? 'Pega o escribe cada nombre en una línea nueva. También puedes usar comas para separarlos.'
                                : 'Escribe el nombre de la ubicación que deseas agregar al sistema.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setShow(false)}
                            disabled={loading}
                            className="flex-1 h-12 rounded-2xl font-semibold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!name.trim() || loading}
                            className="flex-[2] h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Plus className="mr-2 h-5 w-5" />
                            )}
                            {isBulkMode ? `Agregar ${itemCount} Items` : 'Guardar Item'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
