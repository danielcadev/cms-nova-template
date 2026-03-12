export async function isPublicTypePathsEnabled() {
  const { getPluginSettings } = await import('@/modules/plugins/utils')
  const { enabled } = await getPluginSettings('public-typepaths')
  return enabled
}
