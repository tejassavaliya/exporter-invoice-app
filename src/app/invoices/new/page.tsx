import { getParties } from "@/actions/party-actions";
import { getProducts } from "@/actions/product-actions";
import { InvoiceForm } from "@/components/invoice-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewInvoicePage() {
  const parties = await getParties();
  const products = await getProducts();

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="mb-6">
         <Link href="/admin/parties" className="text-sm text-muted-foreground flex items-center gap-2 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
         </Link>
      </div>
      <InvoiceForm parties={parties} products={products} />
    </div>
  )
}
