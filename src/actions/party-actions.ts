"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type PartyType = "EXPORTER" | "CONSIGNEE" | "NOTIFY_PARTY";

export async function getParties() {
  return await db.party.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createParty(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const type = formData.get("type") as PartyType;
  const gstNo = formData.get("gstNo") as string;
  const iec = formData.get("iec") as string;
  const pan = formData.get("pan") as string;

  await db.party.create({
    data: {
      name,
      address,
      type,
      gstNo,
      iec,
      pan,
    },
  });

  revalidatePath("/admin/parties");
}

export async function deleteParty(id: string) {
  await db.party.delete({ where: { id } });
  revalidatePath("/admin/parties");
}
