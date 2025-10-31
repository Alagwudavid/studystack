export interface Video {
  id: number;
  title: string;
  thumbnail: string;
  channel: string;
  channelProfile: string;
  duration: string;
  views: string;
  timeAgo: string;
}

export interface Channel {
  id: number;
  name: string;
  avatar: string;
  verified: boolean;
  followers: string;
  videos: Video[];
}

export const storyChannels: Channel[] = [
  {
    id: 5,
    name: "CodeWithMe",
    avatar: "/stories/user-5.jpg",
    verified: false,
    followers: "1,234",
    videos: [
      {
        id: 15,
        title: "Building a Full-Stack App with Next.js",
        thumbnail: "/stories/video-thumb-13.jpg",
        channel: "CodeWithMe",
        channelProfile: "/stories/user-5.jpg",
        duration: "45:12",
        views: "1.7K",
        timeAgo: "1h ago",
      },
      {
        id: 16,
        title: "Learning python as a language",
        thumbnail: "/stories/video-thumb-13.jpg",
        channel: "CodeWithMe",
        channelProfile: "/stories/user-5.jpg",
        duration: "45:12",
        views: "1.7K",
        timeAgo: "1h ago",
      },
    ],
  },
];
