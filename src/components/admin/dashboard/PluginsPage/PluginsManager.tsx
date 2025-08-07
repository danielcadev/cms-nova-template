'use client';

import { PluginsPageContent } from './PluginsPageContent';
import { usePlugins } from './usePlugins';

export default function PluginsManager() {
  const {
    plugins,
    loading,
    togglePlugin,
    refreshPlugins
  } = usePlugins();

  return (
    <PluginsPageContent
      plugins={plugins}
      isLoading={loading}
      handleTogglePlugin={togglePlugin}
      handleRefresh={refreshPlugins}
    />
  );
}
