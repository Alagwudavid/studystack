interface UserNotesPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function UserNotesPage({ params }: UserNotesPageProps) {
    const { username } = await params;
    return (
        <div className="min-h-96 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center text-gray-500 py-16">
                    <div className="text-primary mb-4 mx-auto w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"><path d="m12.88 7.017l4.774 1.271m-5.796 2.525l2.386.636m-2.267 6.517l.954.255c2.7.72 4.05 1.079 5.114.468c1.063-.61 1.425-1.953 2.148-4.637l1.023-3.797c.724-2.685 1.085-4.027.471-5.085s-1.963-1.417-4.664-2.136l-.954-.255c-2.7-.72-4.05-1.079-5.113-.468c-1.064.61-1.426 1.953-2.15 4.637l-1.022 3.797c-.724 2.685-1.086 4.027-.471 5.085c.614 1.057 1.964 1.417 4.664 2.136Z"/><path d="m12 20.946l-.952.26c-2.694.733-4.04 1.1-5.102.477c-1.06-.622-1.422-1.991-2.143-4.728l-1.021-3.872c-.722-2.737-1.083-4.106-.47-5.184C2.842 6.966 4 7 5.5 7"/></g></svg>
                    </div>
                    <h3 className="text-xl font-semibold">No notes yet</h3>
                    <p className="text-sm">User notes will appear here.</p>
                </div>
            </div>
        </div>
    );
}
