import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { data } = body;

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const productsToCreate = data.map((item: any) => ({
      name: item.name,
      description: item.description || null,
      hsn: item.hsn || null,
      unitPrice: item.unitPrice ? parseFloat(item.unitPrice) : null,
      unit: item.unit || null,
    }));

    // Filter out invalid entries (e.g. missing name)
    const validProducts = productsToCreate.filter((p: any) => p.name);

    if (validProducts.length === 0) {
       return NextResponse.json({ error: "No valid products found (Name is required)" }, { status: 400 });
    }

    await db.product.createMany({
      data: validProducts,
    });

    return NextResponse.json({ message: `Successfully added ${validProducts.length} products` });
  } catch (error) {
    console.error("Product upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload products" },
      { status: 500 }
    );
  }
}
