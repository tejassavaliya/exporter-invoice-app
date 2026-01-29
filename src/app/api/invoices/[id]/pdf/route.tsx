import { db } from "@/lib/db";
import { InvoicePDF } from "@/components/pdf/invoice-pdf";
import { renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const invoice = await db.invoice.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!invoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  const stream = await renderToStream(<InvoicePDF invoice={invoice} />);
  
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Invoice-${invoice.invoiceNo}.pdf"`,
    },
  });
}
