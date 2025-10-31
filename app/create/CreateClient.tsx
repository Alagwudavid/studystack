"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Trophy,
    Lightbulb,
    AlignLeft,
    BookOpen,
    Target,
    Brain,
    Users,
    Camera,
    Video,
    FileText,
    Clock,
    Tag,
    Globe,
    Images,
    X,
    User,
    Building,
    LinkIcon,
    SquarePlay,
    ChevronDown,
    Check,
    Sparkles,
    Rocket,
    Code,
    ArrowLeft,
} from "lucide-react";
import { PostType, categoryArea } from "@/types/social-learning";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const postTypes: { type: PostType; label: string; icon: any; description: string; color: string; disabled?: boolean }[] = [
    {
        type: "resource",
        label: "Study resources",
        icon: LinkIcon,
        description: "Share educational resources",
        color: "bg-indigo-500"
    },
    {
        type: "code",
        label: "Code",
        icon: Code,
        description: "Share code snippets",
        color: "bg-teal-500",
        disabled: true
    },
    {
        type: "tip",
        label: "Study Tip",
        icon: Lightbulb,
        description: "Share a helpful learning technique or insight",
        color: "bg-blue-500"
    },
    {
        type: "achievement",
        label: "Achievement",
        icon: Trophy,
        description: "Celebrate a learning milestone",
        color: "bg-yellow-500"
    },
    {
        type: "question",
        label: "Question",
        icon: Target,
        description: "Ask for help or clarification",
        color: "bg-red-500"
    },
    {
        type: "study-session",
        label: "Study Session",
        icon: BookOpen,
        description: "Share your study progress",
        color: "bg-green-500"
    },
    {
        type: "collaboration",
        label: "Collaboration",
        icon: Users,
        description: "Find study partners or create groups",
        color: "bg-purple-500"
    },
    {
        type: "poll",
        label: "Poll",
        icon: AlignLeft,
        description: "Ask the community for opinions",
        color: "bg-orange-500"
    }
];

const subjects = [
    { value: "mathematics" as categoryArea, label: "Mathematics" },
    { value: "science" as categoryArea, label: "Science" },
    { value: "technology" as categoryArea, label: "Technology" },
    { value: "language" as categoryArea, label: "Language & Literature" },
    { value: "arts" as categoryArea, label: "Arts & Design" },
    { value: "business" as categoryArea, label: "Business" },
    { value: "philosophy" as categoryArea, label: "Philosophy" },
    { value: "history" as categoryArea, label: "History" },
    { value: "other" as categoryArea, label: "Other" }
];

// Sample communities for selection
const availableCommunities = [
    { id: "personal", name: "Your Name", avatar: "/placeholder-user1.png", flag: "", color: "#6B73FF", type: "user" as const },
    { id: "spanish-learners", name: "Spanish Learners Hub", avatar: "/flag/es.png", flag: "es", color: "#FF6B35", type: "community" as const },
    { id: "math-community", name: "Math Enthusiasts", avatar: "/svgs/math-icon.svg", flag: "", color: "#4A90E2", type: "community" as const },
    { id: "tech-hub", name: "Tech Learning Hub", avatar: "/svgs/tech-icon.svg", flag: "", color: "#27AE60", type: "community" as const },
    { id: "art-culture", name: "Art & Culture Exchange", avatar: "/svgs/art-icon.svg", flag: "", color: "#E74C3C", type: "community" as const },
    { id: "language-support", name: "Language Learning Support", avatar: "/svgs/language-icon.svg", flag: "", color: "#8E44AD", type: "community" as const },
];

const difficulties = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
];

export default function CreateClient() {
    const router = useRouter();
    const [selectedProfile, setSelectedProfile] = useState("personal");
    const [selectedType, setSelectedType] = useState<PostType>("achievement");
    const [content, setContent] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<categoryArea[]>([]);
    const [subjectSearchTerm, setSubjectSearchTerm] = useState("");
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
    const [filteredSubjects, setFilteredSubjects] = useState(subjects);
    const [selectedCommunity, setSelectedCommunity] = useState("none");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [studyTime, setStudyTime] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [skills, setSkills] = useState("");
    const [isCollaborative, setIsCollaborative] = useState(false);
    const [maxParticipants, setMaxParticipants] = useState("");

    // New state for additional features
    const [linkUrl, setLinkUrl] = useState("");
    const [linkTitle, setLinkTitle] = useState("");
    const [linkDescription, setLinkDescription] = useState("");
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [collaborationTitle, setCollaborationTitle] = useState("");
    const [pollQuestion, setPollQuestion] = useState("");
    const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedPostType = postTypes.find(pt => pt.type === selectedType);
    const selectedProfileData = availableCommunities.find(c => c.id === selectedProfile);
    const selectedCommunityData = availableCommunities.find(c => c.id === selectedCommunity);

    // Debounced search effect
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            const filtered = subjects.filter(subject =>
                subject.label.toLowerCase().includes(subjectSearchTerm.toLowerCase())
            );
            setFilteredSubjects(filtered);
        }, 300);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [subjectSearchTerm]);

    const handleSubjectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSubjectSearchTerm(value);
        setShowSubjectDropdown(true);
    };

    const handleSubjectSelect = (subject: { value: categoryArea; label: string }) => {
        if (!selectedSubjects.includes(subject.value)) {
            setSelectedSubjects([...selectedSubjects, subject.value]);
        }
        setSubjectSearchTerm("");
        setShowSubjectDropdown(false);
        inputRef.current?.focus();
    };

    const handleSubjectRemove = (subjectToRemove: categoryArea) => {
        setSelectedSubjects(selectedSubjects.filter(subject => subject !== subjectToRemove));
    };

    const getSubjectLabel = (value: categoryArea) => {
        return subjects.find(subject => subject.value === value)?.label || value;
    };

    const addPollOption = () => {
        if (pollOptions.length < 4) {
            setPollOptions([...pollOptions, ""]);
        }
    };

    const removePollOption = (index: number) => {
        if (pollOptions.length > 2) {
            const newOptions = pollOptions.filter((_, i) => i !== index);
            setPollOptions(newOptions);
        }
    };

    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const handleMediaUpload = (files: FileList) => {
        const fileArray = Array.from(files);
        setMediaFiles(prev => [...prev, ...fileArray]);
    };

    const removeMediaFile = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleTypeSelection = (type: PostType) => {
        setSelectedType(type);

        // Handle special behaviors for different types
        if (type === "resource") {
            setShowLinkModal(true);
        } else if (type === "poll") {
            setContent(""); // Clear content for polls
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = () => {
        // Handle post submission
        const postData: any = {
            type: selectedType,
            content: selectedType === "poll" ? pollQuestion : content,
            subjects: selectedSubjects,
            tags,
            studyData: {
                timeSpent: studyTime ? parseInt(studyTime) : undefined,
                difficulty: difficulty as any,
                skills: skills ? skills.split(",").map(s => s.trim()) : []
            }
        };

        // Add type-specific data
        if (selectedType === "collaboration") {
            postData.collaboration = {
                isCollaborative: true,
                maxParticipants: maxParticipants ? Math.min(parseInt(maxParticipants), 200) : undefined,
                title: collaborationTitle
            };
        } else if (selectedType === "poll") {
            postData.poll = {
                question: pollQuestion,
                options: pollOptions.filter(option => option.trim() !== "")
            };
        } else if (selectedType === "resource" && linkUrl) {
            postData.linkData = {
                url: linkUrl,
                title: linkTitle,
                description: linkDescription
            };
        }

        console.log(postData);

        // Navigate back after successful submission
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => router.back()} className={cn("text-foreground px-4 flex items-center gap-1 bg-muted")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m4 10l-.707.707L2.586 10l.707-.707zm17 8a1 1 0 1 1-2 0zM8.293 15.707l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 9h10v2H4zm17 7v2h-2v-2zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5z"></path></svg>
                                    <span>Back</span>
                                </button>
                            <h1 className="text-lg font-semibold">Create Note</h1>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                (selectedType === "poll" && (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2)) ||
                                (selectedType !== "poll" && !content.trim()) ||
                                (selectedType === "collaboration" && !collaborationTitle.trim())
                            }
                            className="bg-primary hover:bg-primary/90"
                        >
                            Share Post
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto p-4">
                <div className="bg-card rounded-2xl border shadow-sm">
                    {/* Profile/Community Switcher */}
                    <div className="p-6 pb-3">
                        <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="flex items-center space-x-3 p-2 h-auto bg-muted hover:bg-muted/80 text-foreground border rounded-xl">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={selectedProfileData?.avatar}
                                                alt={selectedProfileData?.name}
                                            />
                                            <AvatarFallback>
                                                {selectedProfileData?.name?.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start">
                                            <p className="font-semibold text-sm line-clamp-1">
                                                {selectedProfileData?.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {selectedProfileData?.type === "user" ? "Personal" : "Community"}
                                            </p>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 bg-background border shadow-lg rounded-xl p-2" align="start" sideOffset={8}>
                                    <div className="space-y-1">
                                        {availableCommunities.map((profile) => (
                                            <DropdownMenuItem
                                                key={profile.id}
                                                onClick={() => setSelectedProfile(profile.id)}
                                                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedProfile === profile.id
                                                    ? "bg-accent text-accent-foreground"
                                                    : "hover:bg-accent/50"
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3 w-full">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src={profile.avatar}
                                                            alt={profile.name}
                                                        />
                                                        <AvatarFallback style={{ backgroundColor: profile.color }}>
                                                            {profile.name.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className="font-medium text-sm truncate">
                                                            {profile.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {profile.type === "user" ? "Personal" : "Community"}
                                                        </span>
                                                    </div>
                                                    {selectedProfile === profile.id && (
                                                        <Check className="h-4 w-4 text-primary" />
                                                    )}
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Community posting notice */}
                        {selectedProfileData?.type === "community" && (
                            <div className="flex-1 p-3 mt-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    Posting to <strong>{selectedProfileData.name}</strong>. This will appear in the community feed.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col space-y-6 px-6 py-3">
                        {/* Content - Hidden for polls */}
                        {selectedType !== "poll" && (
                            <div className="flex-1">
                                <Textarea
                                    placeholder={`What's your ${selectedPostType?.label.toLowerCase()} about?`}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="min-h-[120px] resize-none border-0 border-l-2 rounded-none"
                                />
                            </div>
                        )}

                        {/* Poll Content */}
                        {selectedType === "poll" && (
                            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <h4 className="font-medium flex items-center">
                                    <AlignLeft className="h-4 w-4 mr-2" />
                                    Create Poll
                                </h4>

                                <div>
                                    <label className="text-sm font-medium mb-1 block">Poll Question</label>
                                    <Input
                                        placeholder="What's your question?"
                                        value={pollQuestion}
                                        onChange={(e) => setPollQuestion(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium block">Options</label>
                                    {pollOptions.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                placeholder={`Option ${index + 1}`}
                                                value={option}
                                                onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                            />
                                            {pollOptions.length > 2 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removePollOption(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {pollOptions.length < 4 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addPollOption}
                                            className="w-full"
                                        >
                                            Add Option
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Media Preview */}
                        {mediaFiles.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium block">Media Preview</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {mediaFiles.map((file, index) => (
                                        <div key={index} className="relative">
                                            {file.type.startsWith('image/') ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Upload ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                    <FileText className="h-8 w-8 text-gray-500" />
                                                    <span className="ml-2 text-sm text-gray-500">{file.name}</span>
                                                </div>
                                            )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeMediaFile(index)}
                                                className="absolute top-1 right-1"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Subject Areas - Multiple Selection with Search */}
                        <div className="relative">
                            <label className="text-sm font-medium mb-2 block">Subject Areas</label>

                            {/* Selected subjects display */}
                            {selectedSubjects.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedSubjects.map((subject) => (
                                        <Badge
                                            key={subject}
                                            variant="secondary"
                                            className="pr-1 p-2 flex items-center gap-1"
                                        >
                                            {getSubjectLabel(subject)}
                                            <button
                                                onClick={() => handleSubjectRemove(subject)}
                                                className="ml-1 hover:text-red-500 transition-colors"
                                                type="button"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Search input */}
                            <div className="relative">
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search and add subject areas..."
                                    value={subjectSearchTerm}
                                    onChange={handleSubjectInputChange}
                                    onFocus={() => setShowSubjectDropdown(true)}
                                    onBlur={() => {
                                        // Delay hiding to allow clicking on dropdown items
                                        setTimeout(() => setShowSubjectDropdown(false), 200);
                                    }}
                                    className="w-full"
                                />

                                {/* Dropdown with filtered subjects */}
                                {showSubjectDropdown && filteredSubjects.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {filteredSubjects
                                            .filter(subject => !selectedSubjects.includes(subject.value))
                                            .map((subject) => (
                                                <button
                                                    key={subject.value}
                                                    type="button"
                                                    onClick={() => handleSubjectSelect(subject)}
                                                    className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-lg last:rounded-b-lg"
                                                >
                                                    {subject.label}
                                                </button>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Show message when no subjects match search */}
                            {showSubjectDropdown && subjectSearchTerm && filteredSubjects.length === 0 && (
                                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg p-3 text-sm text-muted-foreground">
                                    No subjects found matching "{subjectSearchTerm}"
                                </div>
                            )}
                        </div>

                        {/* Study Data - Only time and difficulty for study-session */}
                        {selectedType === "study-session" && (
                            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                                <h4 className="font-medium flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Study Session Details
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Time Spent (minutes)</label>
                                        <Input
                                            type="number"
                                            placeholder="30"
                                            value={studyTime}
                                            onChange={(e) => setStudyTime(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Difficulty</label>
                                        <Select value={difficulty} onValueChange={setDifficulty}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select difficulty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {difficulties.map((diff) => (
                                                    <SelectItem key={diff.value} value={diff.value}>
                                                        {diff.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Collaboration Options */}
                        {selectedType === "collaboration" && (
                            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h4 className="font-medium flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    Collaboration Details
                                </h4>

                                <div>
                                    <label className="text-sm font-medium mb-1 block">Collaboration Title</label>
                                    <Input
                                        placeholder="What are you collaborating on?"
                                        value={collaborationTitle}
                                        onChange={(e) => setCollaborationTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1 block">Max Participants (max 200)</label>
                                    <Input
                                        type="number"
                                        placeholder="5"
                                        max="200"
                                        value={maxParticipants}
                                        onChange={(e) => setMaxParticipants(e.target.value)}
                                        className="w-32"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Media Upload and Post Type Selection */}
                    <div className="flex flex-col gap-4 p-6 py-3 border-t">
                        <div className="flex items-center">
                            {/* Media Upload Buttons */}
                            <div className="flex flex-row flex-wrap">
                                <Tooltip text="Add Photo">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => e.target.files && handleMediaUpload(e.target.files)}
                                        />
                                        <Button variant="outline" size="sm" type="button">
                                            <Images className="!size-6 shrink-0" />
                                        </Button>
                                    </label>
                                </Tooltip>
                                <Tooltip text="Add Video (Coming Soon)">
                                    <Button variant="outline" size="sm" disabled>
                                        <SquarePlay className="!size-6 shrink-0" />
                                    </Button>
                                </Tooltip>
                                {postTypes.map((postType) => {
                                    const Icon = postType.icon;
                                    return (
                                        <Tooltip
                                            key={postType.type}
                                            text={postType.disabled ? `${postType.label} (Coming Soon)` : postType.label}
                                        >
                                            <Button
                                                onClick={() => !postType.disabled && handleTypeSelection(postType.type)}
                                                variant="outline"
                                                size="sm"
                                                disabled={postType.disabled}
                                                className={selectedType === postType.type ? "bg-primary text-primary-foreground" : ""}
                                            >
                                                <Icon className="!size-6 shrink-0" />
                                            </Button>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-6 py-3 border-t">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span>
                                {selectedProfileData?.type === "user" ? "Public post" : `Posting to ${selectedProfileData?.name}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Link Input Modal */}
            <Dialog open={showLinkModal} onOpenChange={setShowLinkModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Resource Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">URL</label>
                            <Input
                                placeholder="https://example.com"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Title (Optional)</label>
                            <Input
                                placeholder="Resource title"
                                value={linkTitle}
                                onChange={(e) => setLinkTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
                            <Textarea
                                placeholder="Brief description"
                                value={linkDescription}
                                onChange={(e) => setLinkDescription(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowLinkModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => setShowLinkModal(false)}
                                disabled={!linkUrl.trim()}
                            >
                                Add Link
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}