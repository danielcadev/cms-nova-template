import React, { useState, useEffect } from 'react';
import { PluginsPageContent } from './PluginsPageContent';
import { S3ConfigModal } from './S3ConfigModal';
import { PluginService } from '@/lib/plugins/service';
import { Plugin } from '@/lib/plugins/config';
import { useToast } from '@/hooks/use-toast';

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { toast } = useToast();

  // Cargar plugins al montar el componente
  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = async () => {
    try {
      setIsLoading(true);
      const pluginData = await PluginService.getAllPlugins();
      setPlugins(pluginData);
    } catch (error) {
      console.error('Error loading plugins:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los plugins",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlugin = async (pluginId: string) => {
    try {
      const newState = await PluginService.togglePlugin(pluginId);
      
      // Actualizar el estado local
      setPlugins(prev => prev.map(plugin => 
        plugin.id === pluginId 
          ? { ...plugin, enabled: newState }
          : plugin
      ));

      const plugin = plugins.find(p => p.id === pluginId);
      toast({
        title: newState ? "Plugin activado" : "Plugin desactivado",
        description: `${plugin?.name} ha sido ${newState ? 'activado' : 'desactivado'} correctamente`,
      });
    } catch (error) {
      console.error('Error toggling plugin:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cambiar el estado del plugin",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = async () => {
    await loadPlugins();
    toast({
      title: "Plugins actualizados",
      description: "La lista de plugins se ha actualizado correctamente",
    });
  };

  const handleConfigurePlugin = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = async (config: Record<string, any>) => {
    if (!selectedPlugin) return;

    try {
      // Para S3, guardar directamente en la API
      if (selectedPlugin.id === 's3-storage' || selectedPlugin.id === 's3') {
        const response = await fetch('/api/plugins/s3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        });

        if (!response.ok) {
          throw new Error('Error al guardar la configuración de S3');
        }

        const result = await response.json();
        console.log('S3 configuración guardada:', result);
      } else {
        // Para otros plugins, usar el servicio
        await PluginService.updatePluginConfig(selectedPlugin.id, config);
      }
      
      await loadPlugins(); // Recargar para obtener la configuración actualizada
      
      toast({
        title: "Configuración guardada",
        description: `La configuración de ${selectedPlugin.name} se ha guardado correctamente`,
      });
    } catch (error) {
      console.error('Error saving plugin config:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <PluginsPageContent 
        plugins={plugins}
        isLoading={isLoading}
        handleTogglePlugin={handleTogglePlugin}
        handleRefresh={handleRefresh}
        onConfigurePlugin={handleConfigurePlugin}
      />
      
      {selectedPlugin && (
        <S3ConfigModal
          plugin={selectedPlugin}
          isOpen={isConfigModalOpen}
          onClose={() => {
            setIsConfigModalOpen(false);
            setSelectedPlugin(null);
          }}
          onSave={handleSaveConfig}
        />
      )}
    </>
  );
}

export { PluginsPageContent };
