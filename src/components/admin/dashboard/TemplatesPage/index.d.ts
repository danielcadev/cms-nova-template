export interface Template {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'draft' | 'coming-soon';
    icon: any;
    category: string;
    createdAt?: string;
    updatedAt?: string;
    contentCount?: number;
    route?: string;
}
export declare function TemplatesPage(): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map