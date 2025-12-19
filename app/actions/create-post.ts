// app/actions/create-post.ts
"use server";

import { revalidatePath } from "next/cache";
// To this (default import):
import prisma from "@/lib/prisma";
import { postSchema } from "@/lib/validation";

export async function createPost(data: unknown) {
  const validated = postSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  await prisma.post.create({
    data: {
      title: validated.data.title,
      slug: validated.data.slug,
      content: validated.data.content,
      published: validated.data.published ?? false,
      categoryId: validated.data.categoryId || null,
      authorId: validated.data.authorId,
    },
  });

  revalidatePath("/dashboard/blog");
  // redirect("/dashboard/blog");
}

export async function updatePost(id: string, data: unknown) {
  const validated = postSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  await prisma.post.update({
    where: { id },
    data: {
      title: validated.data.title,
      slug: validated.data.slug,
      content: validated.data.content,
      published: validated.data.published ?? false,
      categoryId: validated.data.categoryId || null,
      authorId: validated.data.authorId,
    },
  });

  revalidatePath("/dashboard/blog");
  revalidatePath(`/blog/${validated.data.slug}`);
}

export async function getPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}
