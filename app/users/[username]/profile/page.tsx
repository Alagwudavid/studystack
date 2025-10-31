import ContributionGrid from "@/components/ContributionGrid";
import { 
    LinkIcon,
    Globe2Icon,
} from "lucide-react";

interface UserProfilePageProps {
    params: Promise<{
        username: string;
    }>;
}


export default async function UserProfilePage({ params }: UserProfilePageProps) {
    const { username } = await params;

    const community = [
        {
        image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCE5R_BVZ_y22ak4Xwh1OY-00JUA2FXiWNkg&s',
        name: 'Igbo Amaka',
        members: 1201,
        },
        {
        image:
            'https://blog.houseofstaunton.com/wp-content/uploads/2024/11/Chess-King-Wear-a-Crown-Pexels-1024x701.jpg',
        name: 'UNN chess club',
        members: 831,
        },
        {
        image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk1JERmw-aR0WYkoX7VCzWnM-g3X4slPa8tg&s',
        name: 'Daily Scholar',
        members: 30,
        },
        {
        image:
            'https://thumbs.dreamstime.com/b/biology-hand-drawn-doodles-lettering-education-science-vector-white-background-135246167.jpg',
        name: 'Biology Hub',
        members: 303,
        },
    ]

    const Achievements = [
        {
        image:
            '/stickers/bookie.png',
        name: 'Bookie',
        points: 150,
        totalPoints: 1000,
        },
        {
        image:
            '/stickers/checkmate.png',
        name: 'Checkmate',
        points: 2000,
        totalPoints: 2000,
        },
        {
        image:
            '/stickers/earlyBurner.png',
        name: 'Early Burner',
        points: 2300,
        totalPoints: 2500,
        },
        {
        image:
            '/stickers/fighter.png',
        name: 'Fighter',
        points: 1400,
        totalPoints: 3000,
        },
    ]
    return (
        <div className="w-full min-h-96 space-y-4 p-4">  

                <div className="w-full">
                    <div className="mt-6 mb-4">
                        <h2 className="text-lg font-medium text-muted-foreground">Achievements</h2>
                    </div>
                    <div className="container flex flex-row gap-2 overflow-x-auto scrollbar-custom py-4">
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {Achievements.map((profile, index) => (
                            <div key={index} className="flex flex-col items-center">
                            <div className="mb-3">
                                <img
                                src={profile.image}
                                alt={profile.name}
                                className="w-16 h-16 md:w-20 md:h-20 object-cover"
                                />
                            </div>
                            <p className="text-foreground text-base font-medium">{profile.name}</p>
                            <p className="text-muted-foreground text-xs">{profile.points}/{profile.totalPoints}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <div className="mt-6 mb-4">
                        <h2 className="text-lg font-medium text-muted-foreground">Communities</h2>
                    </div>
                    <div className="container flex flex-row overflow-x-auto scrollbar-custom py-4">
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {community.map((profile, index) => (
                            <div key={index} className="flex flex-col items-center mb-3">
                            <div className="rounded-full border-2 border-gray-700 p-1 mb-2">
                                <img
                                src={profile.image}
                                alt={profile.name}
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                                />
                            </div>
                            <p className="text-foreground text-base font-medium">{profile.name}</p>
                            <p className="text-muted-foreground text-sm font-medium">{profile.members} members</p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                <ContributionGrid />
        </div>
    );
}