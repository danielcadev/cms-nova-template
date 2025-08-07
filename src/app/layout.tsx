import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ErrorProvider } from "@/contexts/ErrorContext";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: "Nova CMS - Modern Design",
  description: "Sistema de administración modular con diseño moderno y fluido",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-ios antialiased">
        {/* Modern Glass Background Pattern */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-ios-blue-50/30 via-white to-ios-gray-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_50%)]" />
        </div>
        
        <ErrorProvider>
          {children}
          <Toaster />
        </ErrorProvider>
      </body>
    </html>
  );
} 
