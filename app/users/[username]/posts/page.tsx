import { Edit3 } from "lucide-react";

interface UserPostsPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function UserPostsPage({ params }: UserPostsPageProps) {
    const { username } = await params;

    const stories = [
        {
        image:
            'https://uploadthingy.s3.us-west-1.amazonaws.com/7b8SDfzdY5YHxmmFvKrYkw/image.png',
        name: 'GALATASARAY',
        },
        {
        image:
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjBtYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        name: 'Mazi us',
        },
        {
        image:
            'https://images.unsplash.com/photo-1618886487805-744c5f9c6c69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbiUyMHdpdGglMjBzdW5nbGFzc2VzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        name: 'King Tunde us',
        },
        {
        image:
            'https://images.unsplash.com/photo-1590411506193-00ed62f2d5d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHJlZCUyMGNhcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        name: 'Tunde Ednut',
        },
    ]

    return (
        <div className="min-h-96">
                <div className="text-center text-gray-500 py-16">
                    <div className="text-primary mb-4 mx-auto w-fit">
                        <Edit3 className="size-20" />
                    </div>
                    <h3 className="text-xl font-semibold">No post yet</h3>
                    <p className="text-sm">User posts will appear here.</p>
                </div>
        </div>
    );
}