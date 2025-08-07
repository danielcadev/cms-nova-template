interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onToggle?: () => void;
}
declare function SidebarComponent({ isOpen, onClose, onToggle }: SidebarProps): import("react/jsx-runtime").JSX.Element;
export declare const Sidebar: import("react").MemoExoticComponent<typeof SidebarComponent>;
export {};
//# sourceMappingURL=Sidebar.d.ts.map