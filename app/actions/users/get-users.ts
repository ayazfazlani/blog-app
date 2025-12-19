// app/actions/get-users.ts
"use server";

// To this (default import):
import prisma from "@/lib/prisma";

export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true, // optional avatar
    },
    orderBy: { name: "asc" },
  });
}
