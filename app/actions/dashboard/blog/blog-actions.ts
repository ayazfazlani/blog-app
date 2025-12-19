// app/actions/blog-actions.ts
"use server";

import { revalidatePath } from "next/cache";

// To this (default import):
import prisma from "@/lib/prisma";

export async function getAllPosts() {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
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
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
}

export async function deletePost(id: string) {
  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/dashboard/blog");
  // No redirect needed here – list stays on same page
}

export async function togglePublished(id: string, published: boolean) {
  await prisma.post.update({
    where: { id },
    data: { published: !published },
  });

  revalidatePath("/dashboard/blog");
}
