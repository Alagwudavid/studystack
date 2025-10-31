"use client"

import { HoverableUser } from "@/components/HoverableUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HoverTest() {
    const testUser = {
        id: "test-user",
        username: "johndoe",
        displayName: "John Doe",
        avatar: "/placeholder-user.jpg",
        bio: "This is a test user for hover functionality",
        verified: true,
        type: "user" as const,
        location: "Test City",
        joinDate: "2023-01-15",
        followers: 150,
        following: 89,
        level: 5,
        streak: { current: 7 }
    }

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">Hover Test Page</h1>

            <div className="space-y-4">
                <p>Hover over the avatar or name below to test the functionality:</p>

                <HoverableUser
                    user={testUser}
                    onFollowClick={() => console.log("Follow clicked!")}
                >
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-background">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={testUser.avatar} alt={testUser.displayName} />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-medium hover:underline">{testUser.displayName}</h3>
                            <p className="text-sm text-muted-foreground">@{testUser.username}</p>
                        </div>
                    </div>
                </HoverableUser>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Debug Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Open browser developer tools (F12)</li>
                        <li>Go to Console tab</li>
                        <li>Hover over the user card above</li>
                        <li>Look for debug messages starting with 🐭 and ⏰</li>
                        <li>Check if the hover card appears after 500ms</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}