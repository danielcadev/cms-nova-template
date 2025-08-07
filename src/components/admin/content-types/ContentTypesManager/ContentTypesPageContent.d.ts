interface ContentType {
    id: string;
    name: string;
    apiIdentifier: string;
    description?: string | null;
    fields: any[];
    createdAt: string;
    updatedAt: string;
}
interface ContentTypesPageContentProps {
    contentTypes: ContentType[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filteredContentTypes: ContentType[];
    onRefresh: () => void;
}
export declare function ContentTypesPageContent({ loading, error, filteredContentTypes, onRefresh }: ContentTypesPageContentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ContentTypesPageContent.d.ts.map