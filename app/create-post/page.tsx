import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { OnboardingGuard } from '@/components/OnboardingGuard';

export default async function CreatePostPage() {
    const { user } = await requireAuth();

    return (
        <ProtectedLayout user={user}>
            <OnboardingGuard>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Create Post</h1>
                        <p className="text-muted-foreground mb-8">
                            Share your thoughts, ideas, and experiences with the community.
                        </p>
                        <div className="bg-muted rounded-lg p-8">
                            <p className="text-lg">Coming Soon!</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                This feature is currently under development.
                            </p>
                        </div>
                    </div>
                </div>
            </OnboardingGuard>
        </ProtectedLayout>
    );
}