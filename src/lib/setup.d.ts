import { NovaConfig } from '../types';
import { auth } from './auth';
export declare function setupNova(config: Partial<NovaConfig>): {
    config: NovaConfig;
    auth: {
        handler: typeof auth;
        client: null;
    };
};
//# sourceMappingURL=setup.d.ts.map