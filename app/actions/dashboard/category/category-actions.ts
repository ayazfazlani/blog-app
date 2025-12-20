// app/actions/category-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { categorySchema } from "@/lib/validation";

// READ: Get all categories
export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

//get one category by id
export async function getCategoryById(id: string) {
  return await prisma.category.findUnique({
    where: { id: id },
    include: {
      posts: true, // or select: { posts: { select: { id: true } } } for count only
      _count: { select: { posts: true } }, // Adds postsCount field
    },
  });
}

// CREATE
export async function createCategory(data: unknown) {
  const validated = categorySchema.parse(data); // Secure validation

  console.log("Creating category:", validated.name);  
  try {
    const result = await prisma.category.create({
      data: { name: validated.name },
    });
    console.log("Category created:", result);
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

// UPDATE
export async function updateCategory(id: string, data: unknown) {
  const validated = categorySchema.parse(data);

  const existing = await prisma.category.findFirst({
    where: { name: validated.name, NOT: { id } },
  });
  if (existing) throw new Error("Another category with this name exists");

  await prisma.category.update({
    where: { id },
    data: { name: validated.name },
  });

  revalidatePath("/dashboard/category");
}

// DELETE
export async function deleteCategory(id: string) {
  // Optional: Check if category has posts
  const postsCount = await prisma.post.count({ where: { categoryId: id } });
  if (postsCount > 0) throw new Error("Cannot delete category with posts");

  await prisma.category.delete({ where: { id } });

  revalidatePath("/dashboard/category");
}
