import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter which is standard in Next 14
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Export Invoice Builder",
  description: "Create and manage export invoices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen bg-background font-sans`}
      >
        <header className="border-b bg-background sticky top-0 z-50">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-8">
              <a href="/" className="font-bold text-xl tracking-tight">
                ExportDocs
              </a>
              <nav className="flex items-center gap-6 text-sm font-medium">
                <a href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                  Invoices
                </a>
                <a href="/admin/parties" className="text-muted-foreground transition-colors hover:text-foreground">
                  Parties
                </a>
                <a href="/admin/products" className="text-muted-foreground transition-colors hover:text-foreground">
                  Products
                </a>
              </nav>
            </div>
            <div>
               {/* Actions */}
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
