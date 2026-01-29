"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const hsn = formData.get("hsn") as string;
  const unitPrice = parseFloat(formData.get("unitPrice") as string) || 0;
  const unit = formData.get("unit") as string;

  await db.product.create({
    data: {
      name,
      description,
      hsn,
      unitPrice,
      unit,
    },
  });

  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await db.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
