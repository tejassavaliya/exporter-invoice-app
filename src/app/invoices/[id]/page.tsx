import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { notFound } from "next/navigation";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = await db.invoice.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!invoice) notFound();

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground flex items-center gap-2 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex gap-2">
           <Button asChild variant="outline">
             <Link href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
               <Printer className="w-4 h-4 mr-2" /> Print / Preview
             </Link>
           </Button>
           <Button asChild>
             <Link href={`/api/invoices/${invoice.id}/pdf`} download>
               <Download className="w-4 h-4 mr-2" /> Download PDF
             </Link>
           </Button>
        </div>
      </div>

      <Card className="bg-white">
        <CardHeader className="border-b">
           <div className="flex justify-between">
              <div>
                 <CardTitle className="text-2xl">INVOICE</CardTitle>
                 <p className="text-muted-foreground">{invoice.invoiceNo}</p>
              </div>
              <div className="text-right">
                 <p className="font-medium">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                 <p className="text-sm text-muted-foreground">Status: Generated</p>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
           <div className="grid grid-cols-2 gap-8">
              <div>
                 <h3 className="font-semibold text-sm text-muted-foreground mb-1">EXPORTER</h3>
                 <p className="font-medium">{invoice.exporterName}</p>
                 <p className="whitespace-pre-line text-sm">{invoice.exporterAddress}</p>
              </div>
              <div className="text-right">
                 <h3 className="font-semibold text-sm text-muted-foreground mb-1">CONSIGNEE</h3>
                 <p className="font-medium">{invoice.consigneeName}</p>
                 <p className="whitespace-pre-line text-sm">{invoice.consigneeAddress}</p>
              </div>
           </div>

           <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-4">ITEMS</h3>
              <table className="w-full text-sm">
                 <thead className="border-b">
                    <tr>
                       <th className="text-left py-2">Description</th>
                       <th className="text-right py-2">Qty</th>
                       <th className="text-right py-2">Rate</th>
                       <th className="text-right py-2">Amount</th>
                    </tr>
                 </thead>
                 <tbody>
                    {invoice.items.map(item => (
                       <tr key={item.id} className="border-b last:border-0">
                          <td className="py-2">{item.description}</td>
                          <td className="py-2 text-right">{item.quantity}</td>
                          <td className="py-2 text-right">${item.rate.toFixed(2)}</td>
                          <td className="py-2 text-right">${item.totalAmount.toFixed(2)}</td>
                       </tr>
                    ))}
                 </tbody>
                 <tfoot>
                    <tr>
                       <td colSpan={3} className="pt-4 text-right font-bold">Total CIF</td>
                       <td className="pt-4 text-right font-bold">${invoice.totalAmountCIF.toFixed(2)}</td>
                    </tr>
                 </tfoot>
              </table>
              <p className="mt-2 text-sm text-muted-foreground uppercase">{invoice.amountInWords}</p>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
