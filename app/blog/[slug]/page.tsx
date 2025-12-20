// app/blog/[slug]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, User} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { ReadOnlyEditor } from "@/components/ui/read-only-editor";

// Force dynamic rendering to prevent prerendering during build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
 const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch the single post by slug
  const post = await prisma.post.findFirst({
    where: {
      slug: slug,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  // If post not found or not published, show 404
  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Featured Image (if exists) */}
      {/* {post.imageUrl && (
        <div className="mb-8 -mx-4 md:mx-0">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )} */}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          {post.author?.name || "Anonymous"}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {format(new Date(post.createdAt), "MMMM d, yyyy")}
        </div>
        {/* {post.readTime && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {post.readTime}
          </div>
        )} */}
      </div>

      {/* Category Badge (optional) */}
      {/* {post.category && (
        <Badge variant="secondary" className="mb-8">
          {post.category}
        </Badge>
      )} */}

      {/* Main Content */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        {post.content && (
          <ReadOnlyEditor 
            content={post.content} 
            className="leading-8"
          />
        )}
      </article>

      {/* Optional: Back to blog link */}
      <div className="mt-12 pt-8 border-t">
        {/* <Link
          href="/blog"
          className="text-primary hover:underline inline-flex items-center"
        >
          ← Back to all articles
        </Link> */}
      </div>
    </div>
  );
}