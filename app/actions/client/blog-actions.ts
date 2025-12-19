import prisma from "@/lib/prisma";

export async function getPublishedPosts(categoryId?: string | null) {
    // Build where clause conditionally
    const where: {
        published: boolean;
        categoryId?: string;
    } = {
        published: true,
    };
    
    // Only add categoryId filter if provided and not empty
    if (categoryId && typeof categoryId === 'string' && categoryId.trim().length > 0) {
        where.categoryId = categoryId.trim();
    }
    
    const posts = await prisma.post.findMany({
        where,
        include: {
            author: true,
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return posts;
}