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

    const validTypes = ["EXPORTER", "CONSIGNEE", "NOTIFY_PARTY"];

    const partiesToCreate = data.map((item: any) => {
        let type = item.type?.toUpperCase().trim();
        // Fallback or validation could happen here. 
        // For now, if type is invalid, it might fail database constraint or we filter it.
        // Let's default to CONSIGNEE if missing/invalid to be safe, or just let it fail if strict.
        // Actually, strict is better for data integrity.
        
        return {
            name: item.name,
            type: type, 
            address: item.address || null,
            gstNo: item.gstNo || null,
            iec: item.iec || null,
            pan: item.pan || null,
        }
    });

    const validParties = partiesToCreate.filter((p: any) => p.name && validTypes.includes(p.type));

    if (validParties.length === 0) {
       return NextResponse.json({ error: "No valid parties found. Check 'name' and 'type' (EXPORTER, CONSIGNEE, NOTIFY_PARTY)" }, { status: 400 });
    }

    await db.party.createMany({
      data: validParties,
    });

    return NextResponse.json({ message: `Successfully added ${validParties.length} parties` });
  } catch (error) {
    console.error("Party upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload parties" },
      { status: 500 }
    );
  }
}
