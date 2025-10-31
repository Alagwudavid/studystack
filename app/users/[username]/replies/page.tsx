interface UserRepliesPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function UserRepliesPage({ params }: UserRepliesPageProps) {
    const { username } = await params;
    return (
        <div className="min-h-96">
            <div className="text-center text-gray-400 py-16">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold mb-2 text-white">No videos yet</h3>
                <p className="text-sm text-gray-500">This channel hasn't uploaded any videos yet.</p>
            </div>
        </div>
    );
}
