interface ContentTypeData {
    id: string;
    name: string;
    apiIdentifier: string;
    description?: string | null;
    fields: any[];
    createdAt: string;
    updatedAt: string;
}
interface ContentTypesPageProps {
    initialContentTypes: ContentTypeData[];
}
export declare function ContentTypesPage({ initialContentTypes }: ContentTypesPageProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map