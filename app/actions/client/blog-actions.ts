import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Category from "@/models/Category";

export async function getPublishedPosts(categoryId?: string | null) {
    await connectToDatabase();
    
    // Build query conditionally
    const query: any = { published: true };
    
    // Only add categoryId filter if provided and not empty
    if (categoryId && typeof categoryId === 'string' && categoryId.trim().length > 0) {
        query.categoryId = categoryId.trim();
    }
    
    const posts = await Post.find(query)
        .populate('authorId', 'name email')
        .populate('categoryId', 'name')
        .sort({ createdAt: -1 })
        .lean();
    
    return posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        content: post.content,
        published: post.published,
        categoryId: post.categoryId ? (typeof post.categoryId === 'object' ? post.categoryId._id.toString() : post.categoryId.toString()) : null,
        category: post.categoryId && typeof post.categoryId === 'object' ? {
            id: post.categoryId._id.toString(),
            name: post.categoryId.name,
        } : null,
        authorId: post.authorId ? (typeof post.authorId === 'object' ? post.authorId._id.toString() : post.authorId.toString()) : null,
        author: post.authorId && typeof post.authorId === 'object' ? {
            id: post.authorId._id.toString(),
            name: post.authorId.name,
            email: post.authorId.email,
        } : null,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    }));
}