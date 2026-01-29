"use server";

import { db } from "@/lib/db";
import { invoiceSchema, InvoiceFormValues } from "@/lib/schemas/invoice-schema";
import { numberToWords } from "@/lib/number-to-words";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoice(data: InvoiceFormValues) {
  const result = invoiceSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Invalid formulation");
  }
  const vals = result.data;

  // Calculate totals
  const totalAmountCIF = vals.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const amountInWords = numberToWords(totalAmountCIF);

  const invoice = await db.invoice.create({
    data: {
      invoiceNo: vals.invoiceNo,
      invoiceDate: new Date(vals.invoiceDate),
      
      exporterName: vals.exporterName,
      exporterAddress: vals.exporterAddress || "",
      exporterGstNo: vals.gstNo,
      exporterIec: vals.iec,
      exporterLutNo: vals.lutNo,
      state: vals.state,
      stateCode: vals.stateCode,
      districtCode: vals.districtCode,
      tradeAgreementCode: vals.tradeAgreementCode,

      consigneeName: vals.consigneeName,
      consigneeAddress: vals.consigneeAddress || "",

      notifyName: vals.notifyName || "",
      notifyAddress: vals.notifyAddress || "",

      preCarriageBy: vals.preCarriageBy,
      placeOfReceipt: vals.placeOfReceipt,
      countryOfOrigin: vals.countryOfOrigin,
      countryOfDestination: vals.countryOfDestination,
      vesselFlightNo: vals.vesselFlightNo,
      portOfLoading: vals.portOfLoading,
      portOfDischarge: vals.portOfDischarge,
      finalDestination: vals.finalDestination,

      buyersOrderNo: vals.buyersOrderNo,
      piNo: vals.piNo,
      termsOfPayment: vals.termsOfPayment,
      modeOfTransport: vals.modeOfTransport,

      totalAmountCIF,
      amountInWords,

      items: {
        create: vals.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          totalAmount: item.quantity * item.rate,
          marksAndNos: item.marksAndNos,
          hsn: item.hsn,
          srNo: item.srNo
        }))
      }
    }
  });

  revalidatePath("/invoices");
  redirect(`/invoices/${invoice.id}`);
}
