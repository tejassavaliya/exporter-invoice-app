"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { invoiceSchema, InvoiceFormValues } from "@/lib/schemas/invoice-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createInvoice } from "@/actions/invoice-actions";
import { useEffect } from "react";
import type { Party, Product } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
  parties: Party[];
  products: Product[];
}

export function InvoiceForm({ parties, products }: InvoiceFormProps) {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: {
      invoiceDate: new Date().toISOString().split("T")[0],
      items: [{ description: "", quantity: 0, rate: 0 }],
      totalAmountCIF: 0,
    } as any,
  });

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const exporterId = watch("exporterId");
  const consigneeId = watch("consigneeId");
  const notifyId = watch("notifyId");

  // Auto-fill effects
  useEffect(() => {
    if (exporterId) {
      const p = parties.find(party => party.id === exporterId);
      if (p) {
        setValue("exporterName", p.name);
        setValue("exporterAddress", p.address || "");
        setValue("gstNo", p.gstNo || "");
        setValue("iec", p.iec || "");
        // Reset valid check for these fields if needed
      }
    }
  }, [exporterId, parties, setValue]);

  useEffect(() => {
    if (consigneeId) {
      const p = parties.find(party => party.id === consigneeId);
      if (p) {
        setValue("consigneeName", p.name);
        setValue("consigneeAddress", p.address || "");
      }
    }
  }, [consigneeId, parties, setValue]);

  useEffect(() => {
    if (notifyId) {
      const p = parties.find(party => party.id === notifyId);
      if (p) {
        setValue("notifyName", p.name);
        setValue("notifyAddress", p.address || "");
      }
    }
  }, [notifyId, parties, setValue]);

  // Calculations
  const items = watch("items");
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.rate || 0)), 0);

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      await createInvoice(data);
    } catch (error) {
      console.error(error);
      alert("Error saving invoice");
    }
  };

  const exporters = parties.filter(p => p.type === "EXPORTER");
  const consignees = parties.filter(p => p.type === "CONSIGNEE");
  const notifiers = parties.filter(p => p.type === "NOTIFY_PARTY");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold">New Export Invoice</h1>
         <Button type="submit" size="lg">Generate Invoice</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Header & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice No</Label>
                  <Input {...register("invoiceNo")} placeholder="INV-001" />
                  {errors.invoiceNo && <span className="text-red-500 text-xs">{errors.invoiceNo.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" {...register("invoiceDate")} />
                  {errors.invoiceDate && <span className="text-red-500 text-xs">{errors.invoiceDate.message}</span>}
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Buyer's Order No</Label>
                  <Input {...register("buyersOrderNo")} />
                </div>
                <div className="space-y-2">
                  <Label>PI No</Label>
                  <Input {...register("piNo")} />
                </div>
             </div>
             <div className="space-y-2">
                <Label>Terms of Payment</Label>
                <Input {...register("termsOfPayment")} placeholder="e.g. 100% Advance" />
             </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader><CardTitle>Compliance</CardTitle></CardHeader>
           <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GST No</Label>
                <Input {...register("gstNo")} />
              </div>
              <div className="space-y-2">
                <Label>IEC</Label>
                <Input {...register("iec")} />
              </div>
              <div className="space-y-2">
                <Label>LUT No</Label>
                <Input {...register("lutNo")} />
              </div>
              <div className="space-y-2">
                <Label>State Code</Label>
                <Input {...register("stateCode")} />
              </div>
           </CardContent>
        </Card>

        {/* Parties */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Party Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Exporter */}
             <div className="space-y-4 border p-4 rounded">
                <Label className="font-bold">Exporter</Label>
                <select 
                  className="w-full border p-2 rounded text-sm mb-2" 
                  {...register("exporterId")}
                >
                   <option value="">Select Exporter</option>
                   {exporters.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <Input {...register("exporterName")} placeholder="Name" />
                <textarea 
                  className="w-full border p-2 rounded text-sm min-h-[80px]" 
                  {...register("exporterAddress")} 
                  placeholder="Address" 
                />
             </div>
             
             {/* Consignee */}
             <div className="space-y-4 border p-4 rounded">
                <Label className="font-bold">Consignee</Label>
                <select 
                  className="w-full border p-2 rounded text-sm mb-2" 
                  {...register("consigneeId")}
                >
                   <option value="">Select Consignee</option>
                   {consignees.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <Input {...register("consigneeName")} placeholder="Name" />
                <textarea 
                   className="w-full border p-2 rounded text-sm min-h-[80px]" 
                   {...register("consigneeAddress")} 
                   placeholder="Address" 
                />
             </div>

             {/* Notify */}
             <div className="space-y-4 border p-4 rounded">
                <Label className="font-bold">Notify Party</Label>
                <select 
                  className="w-full border p-2 rounded text-sm mb-2" 
                  {...register("notifyId")}
                >
                   <option value="">Select Notify Party</option>
                   {notifiers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <Input {...register("notifyName")} placeholder="Name" />
                <textarea 
                   className="w-full border p-2 rounded text-sm min-h-[80px]" 
                   {...register("notifyAddress")} 
                   placeholder="Address" 
                />
             </div>
          </CardContent>
        </Card>

        {/* Logistics */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Shipment & Logistics</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="space-y-1"><Label>Pre-carriage per</Label><Input {...register("preCarriageBy")} /></div>
             <div className="space-y-1"><Label>Place of Receipt</Label><Input {...register("placeOfReceipt")} /></div>
             <div className="space-y-1"><Label>Country of Origin</Label><Input {...register("countryOfOrigin")} /></div>
             <div className="space-y-1"><Label>Country of Dest.</Label><Input {...register("countryOfDestination")} /></div>
             
             <div className="space-y-1"><Label>Vessel/Flight No</Label><Input {...register("vesselFlightNo")} /></div>
             <div className="space-y-1"><Label>Port of Loading</Label><Input {...register("portOfLoading")} /></div>
             <div className="space-y-1"><Label>Port of Discharge</Label><Input {...register("portOfDischarge")} /></div>
             <div className="space-y-1"><Label>Final Destination</Label><Input {...register("finalDestination")} /></div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="md:col-span-2">
           <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Invoice Items</CardTitle>
              <Button type="button" onClick={() => append({ description: "", quantity: 0, rate: 0, totalAmount: 0 })} size="sm">
                 <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
           </CardHeader>
           <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                       <th className="text-left py-2 px-2 w-[50px]">Sr</th>
                       <th className="text-left py-2 px-2">Marks</th>
                       <th className="text-left py-2 px-2 w-[300px]">Description of Goods</th>
                       <th className="text-left py-2 px-2 w-[80px]">HSN</th>
                       <th className="text-right py-2 px-2 w-[100px]">Qty</th>
                       <th className="text-right py-2 px-2 w-[100px]">Rate ($)</th>
                       <th className="text-right py-2 px-2 w-[120px]">Amount ($)</th>
                       <th className="w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                     {fields.map((field, index) => {
                        return (
                           <tr key={field.id} className="border-b">
                              <td className="p-2"><Input {...register(`items.${index}.srNo`)} className="h-8" /></td>
                              <td className="p-2"><Input {...register(`items.${index}.marksAndNos`)} className="h-8" /></td>
                              <td className="p-2 relative">
                                 <Input 
                                   list={`products-${index}`}
                                   {...register(`items.${index}.description`)} 
                                   className="h-8" 
                                   onChange={(e) => {
                                      // Optional: Auto-fill rate from product if exists
                                      const val = e.target.value;
                                      const prod = products.find(p => p.name === val);
                                      if (prod) {
                                         setValue(`items.${index}.hsn`, prod.hsn || "");
                                         setValue(`items.${index}.rate`, prod.unitPrice || 0);
                                      }
                                      register(`items.${index}.description`).onChange(e); // propagate
                                   }}
                                 />
                                 <datalist id={`products-${index}`}>
                                    {products.map(p => <option key={p.id} value={p.name} />)}
                                 </datalist>
                              </td>
                              <td className="p-2"><Input {...register(`items.${index}.hsn`)} className="h-8" /></td>
                              <td className="p-2"><Input type="number" step="any" {...register(`items.${index}.quantity`)} className="h-8 text-right" /></td>
                              <td className="p-2"><Input type="number" step="0.01" {...register(`items.${index}.rate`)} className="h-8 text-right" /></td>
                              <td className="p-2 text-right font-medium">
                                 {((Number(watch(`items.${index}.quantity`) || 0) * Number(watch(`items.${index}.rate`) || 0))).toFixed(2)}
                              </td>
                              <td className="p-2">
                                 <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
                  <tfoot>
                     <tr className="bg-muted">
                        <td colSpan={6} className="text-right font-bold p-4">Total Value (CIF) USD:</td>
                        <td className="text-right font-bold p-4">{totalAmount.toFixed(2)}</td>
                        <td></td>
                     </tr>
                  </tfoot>
                </table>
              </div>
           </CardContent>
        </Card>
      </div>
    </form>
  )
}
