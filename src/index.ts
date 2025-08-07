// ===============================================
// CMS Nova - Sistema de Administración Modular
// ===============================================

// --------- VERSION ---------
export const NOVA_VERSION = '1.0.0-beta.1';

// --------- COMPONENTE PRINCIPAL ---------
export function NovaAdminProvider({ children, config }: { children: React.ReactNode; config: any }) {
  return <div className="nova-cms-admin">{children}</div>;
}

// --------- CONFIGURACIÓN ---------
export function createNovaConfig(config: any) {
  return {
    auth: { secret: '', adminRoles: ['ADMIN'], ...config.auth },
    database: { url: '', provider: 'postgresql', ...config.database },
    ui: { theme: 'light', title: 'CMS Nova', ...config.ui },
    features: { users: true, plans: true, contentTypes: true, ...config.features }
  };
}

// --------- UTILIDADES ---------
export { cn } from './lib/utils';

// --------- NOTA ---------
// Para usar como librería, importar también los estilos:
// import '@nova/cms-admin/src/app/globals.css'
//
// Componentes específicos se pueden importar directamente:
// import { AdminLayout } from '@nova/cms-admin/src/components/admin/AdminLayout'
// import { Dashboard } from '@nova/cms-admin/src/components/admin/dashboard/DashboardPage/Dashboard'
