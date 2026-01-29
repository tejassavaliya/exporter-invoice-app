import { z } from "zod";

export const invoiceItemSchema = z.object({
  marksAndNos: z.string().optional(),
  hsn: z.string().optional(),
  srNo: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01, "Qty required"),
  rate: z.coerce.number().min(0, "Rate required"),
  totalAmount: z.number().optional(),
});

export const invoiceSchema = z.object({
  invoiceNo: z.string().min(1, "Invoice No is required"),
  invoiceDate: z.string().min(1, "Date is required"),
  
  // Exporter
  exporterId: z.string().optional(), // Optional, used for lookup
  exporterName: z.string().min(1, "Exporter Name required"),
  exporterAddress: z.string().optional(),
  
  // Compliance (these might come from exporter but are editable)
  gstNo: z.string().optional(),
  iec: z.string().optional(),
  lutNo: z.string().optional(),
  state: z.string().optional(),
  stateCode: z.string().optional(),
  districtCode: z.string().optional(),
  tradeAgreementCode: z.string().optional(),
  
  // Consignee
  consigneeId: z.string().optional(),
  consigneeName: z.string().min(1, "Consignee Name required"),
  consigneeAddress: z.string().optional(),

  // Notify
  notifyId: z.string().optional(),
  notifyName: z.string().optional(),
  notifyAddress: z.string().optional(),

  // References
  buyersOrderNo: z.string().optional(),
  piNo: z.string().optional(),
  termsOfPayment: z.string().optional(),
  modeOfTransport: z.string().optional(),

  // Shipment
  preCarriageBy: z.string().optional(),
  placeOfReceipt: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  countryOfDestination: z.string().optional(),
  vesselFlightNo: z.string().optional(),
  portOfLoading: z.string().optional(),
  portOfDischarge: z.string().optional(),
  finalDestination: z.string().optional(),

  // Items
  items: z.array(invoiceItemSchema).min(1, "Add at least one item"),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
