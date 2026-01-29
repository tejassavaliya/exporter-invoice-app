import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, email, password, role } = await req.json();

    if (!email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
        return new NextResponse("User already exists", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("[USERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        }
      });
  
      return NextResponse.json(users);
    } catch (error) {
      console.error("[USERS_GET]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
