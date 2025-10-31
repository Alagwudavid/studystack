"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin } from "lucide-react";

interface CreateEventPageProps {
    user?: {
        name: string;
        profile_image?: string | null;
    };
}

export default function CreateEventPage({ user }: CreateEventPageProps) {
    const router = useRouter();
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventLocation, setEventLocation] = useState("");

    const handleSubmit = () => {
        console.log("=== EVENT SUBMISSION ===");
        console.log("Title:", eventTitle);
        console.log("Description:", eventDescription);
        console.log("Date:", eventDate);
        console.log("Time:", eventTime);
        console.log("Location:", eventLocation);
        console.log("User:", user);
        console.log("=== END EVENT SUBMISSION ===");

        router.back();
    };

    const hasValidContent = eventTitle.trim().length > 0 && eventDate.length > 0;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Create Event</h2>
                        <p className="text-sm text-muted-foreground">Organize study sessions or community events</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.profile_image || ""} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">{user?.name}</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Event Title *</label>
                        <Input
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="Study session, workshop, meetup..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Date *
                            </label>
                            <Input
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Time
                            </label>
                            <Input
                                type="time"
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Location
                        </label>
                        <Input
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            placeholder="Online, Library, Campus..."
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            placeholder="What will happen at this event? What should participants bring or prepare?"
                            className="min-h-[100px] resize-none"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        Create events to connect with other learners
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={!hasValidContent}>
                            Create Event
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}