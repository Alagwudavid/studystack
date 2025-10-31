import { notFound } from "next/navigation";
import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { OnboardingGuard } from '@/components/OnboardingGuard';
import { getPostBySlug, getCommentsByPostId } from "@/data/social-learning";
import PostDetailClient from "./PostDetailClient";

interface PostDetailPageProps {
    params: {
        slug: string;
    };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
    // Require authentication - will redirect to login if not authenticated
    const { user } = await requireAuth();

    // In Next.js 15, params need to be awaited
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const comments = getCommentsByPostId(post.id);

    return (
        <ProtectedLayout user={user}>
            <OnboardingGuard>
                <PostDetailClient post={post} comments={comments} />
            </OnboardingGuard>
        </ProtectedLayout>
    );
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
    // In a real app, you'd fetch this from your database
    const posts = [
        { slug: "jctb575yz" },
        { slug: "xp9kl2m3n" },
        { slug: "qr8wt5u6v" },
        { slug: "bg4hj7k8l" },
        { slug: "mn9op1q2r" },
        { slug: "df3gh6i7j" },
        { slug: "st4uv7w8x" },
        { slug: "yz5ab8c9d" },
        { slug: "ef6gh9i0j" },
        { slug: "kl1mn4o5p" },
        { slug: "qr2st5u6v" },
        { slug: "wx3yz6a7b" },
        { slug: "cd4ef7g8h" },
        { slug: "ij5kl8m9n" },
        { slug: "op6qr9s0t" },
        { slug: "uv7wx0y1z" },
        { slug: "ab8cd1e2f" },
        { slug: "gh9ij2k3l" },
        { slug: "mn0op3q4r" },
        { slug: "st4uv5w6x" },
        { slug: "yz7ab0c1d" },
        { slug: "ef8gh1i2j" },
        { slug: "kl9mn2o3p" },
        { slug: "qr0st3u4v" },
        { slug: "wx1yz4a5b" },
        { slug: "cd2ef5g6h" },
        { slug: "ij3kl6m7n" },
    ];

    return posts.map((post) => ({
        slug: post.slug,
    }));
}