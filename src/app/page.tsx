import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const invoices = await db.invoice.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="container mx-auto py-10">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Export Invoices</h1>
            <p className="text-muted-foreground">Manage and generate export documentation</p>
          </div>
          <Button asChild size="lg">
             <Link href="/invoices/new">
               <Plus className="mr-2 h-4 w-4" /> Create Invoice
             </Link>
          </Button>
       </div>

       <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
            </CardContent>
          </Card>
           {/* Add more metrics later */}
       </div>

       <Card>
          <CardHeader>
             <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
             {invoices.length === 0 ? (
                <div className="text-center py-10">
                   <p className="text-muted-foreground mb-4">No invoices created yet.</p>
                   <Button asChild variant="outline">
                     <Link href="/invoices/new">Create your first invoice</Link>
                   </Button>
                </div>
             ) : (
                <div className="w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Invoice No</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Exporter</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Consignee</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 font-medium">{invoice.invoiceNo}</td>
                          <td className="p-4">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                          <td className="p-4">{invoice.exporterName}</td>
                          <td className="p-4">{invoice.consigneeName}</td>
                          <td className="p-4 text-right font-medium">${invoice.totalAmountCIF.toFixed(2)}</td>
                          <td className="p-4 text-right">
                             <Button asChild variant="ghost" size="sm">
                                <Link href={`/invoices/${invoice.id}`}>View</Link>
                             </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             )}
          </CardContent>
       </Card>
    </div>
  )
}
