import { NextResponse } from "next/server";
// To this (default import):
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"; // Must use bcryptjs to match NextAuth

export async function POST(req: Request) {
  console.log("Register API called");
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash password
  const user = await prisma.user.create({
    data: { email, name, password: hashedPassword },
  });

  return NextResponse.json({ success: true, user });
}
