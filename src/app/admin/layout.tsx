import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl">
              ExportDocs
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/admin/parties" className="text-muted-foreground hover:text-foreground">
                Parties
              </Link>
              <Link href="/admin/products" className="text-muted-foreground hover:text-foreground">
                Products
              </Link>
              <Link href="/invoices/new" className="text-primary hover:underline">
                New Invoice
              </Link>
            </nav>
          </div>
          <div>
             {/* User profile or settings */}
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/10 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
