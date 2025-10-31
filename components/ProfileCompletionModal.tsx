"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, MapPin, User, Check, Smile, X, Loader2, Image } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import BannerImageUpload from "@/components/BannerImageUpload";

interface ProfileCompletionData {
    profile_image?: string;
    banner_image?: string;
    name?: string;
    username?: string;
    bio?: string;
    date_of_birth?: string;
    location?: string;
}

interface ProfileCompletionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: any;
    onComplete: () => void;
}

export function ProfileCompletionModal({
    open,
    onOpenChange,
    user,
    onComplete,
}: ProfileCompletionModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState<ProfileCompletionData>({});
    const [dateOfBirth, setDateOfBirth] = useState<Date>();
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { refreshProfile } = useAuth();

    // Username availability checking state
    const [usernameStatus, setUsernameStatus] = useState<{
        checking: boolean;
        available: boolean | null;
        message: string;
    }>({
        checking: false,
        available: null,
        message: ''
    });
    const [usernameCheckTimer, setUsernameCheckTimer] = useState<NodeJS.Timeout | null>(null);

    // Username validation function
    const validateUsername = (username: string): { valid: boolean; message: string } => {
        if (!username || username.length < 3) {
            return { valid: false, message: 'Username must be at least 3 characters long' };
        }
        if (username.length > 30) {
            return { valid: false, message: 'Username must be less than 30 characters' };
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return { valid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
        }
        if (/^[_-]/.test(username) || /[_-]$/.test(username)) {
            return { valid: false, message: 'Username cannot start or end with underscore or hyphen' };
        }
        return { valid: true, message: '' };
    };

    // Debounced username availability check
    const checkUsernameAvailability = useCallback(async (username: string) => {
        const validation = validateUsername(username);

        if (!validation.valid) {
            setUsernameStatus({
                checking: false,
                available: false,
                message: validation.message
            });
            return;
        }

        // Skip check if username hasn't changed from current user's username
        if (username === user?.username) {
            setUsernameStatus({
                checking: false,
                available: true,
                message: 'This is your current username'
            });
            return;
        }

        setUsernameStatus({
            checking: true,
            available: null,
            message: 'Checking availability...'
        });

        try {
            const response = await apiClient.checkUsernameAvailability(username);

            if (response.success) {
                setUsernameStatus({
                    checking: false,
                    available: response.data.available,
                    message: response.data.available ?
                        'Username is available' :
                        'Username is already taken'
                });
            } else {
                throw new Error(response.message || 'Failed to check username');
            }
        } catch (error: any) {
            console.error('Username check error:', error);
            setUsernameStatus({
                checking: false,
                available: false,
                message: 'Error checking username availability'
            });
        }
    }, [user?.username]);

    // Handle username input change with debouncing
    const handleUsernameChange = (username: string) => {
        setProfileData(prev => ({ ...prev, username }));

        // Clear existing timer
        if (usernameCheckTimer) {
            clearTimeout(usernameCheckTimer);
        }

        // Reset status for empty username
        if (!username.trim()) {
            setUsernameStatus({
                checking: false,
                available: null,
                message: ''
            });
            return;
        }

        // Set new timer for debounced check
        const newTimer = setTimeout(() => {
            checkUsernameAvailability(username.trim());
        }, 800); // 800ms delay

        setUsernameCheckTimer(newTimer);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (usernameCheckTimer) {
                clearTimeout(usernameCheckTimer);
            }
        };
    }, [usernameCheckTimer]);

    const steps = [
        {
            title: "Profile Picture",
            description: "Add a profile picture or Bemoji to personalize your account",
            icon: Camera,
        },
        {
            title: "Banner Image",
            description: "Add a banner image to showcase your personality",
            icon: Image,
        },
        {
            title: "Username",
            description: "Choose a unique username that represents you",
            icon: User,
        },
        {
            title: "About You",
            description: "Tell others about yourself and your interests",
            icon: User,
        },
        {
            title: "Date of Birth",
            description: "Help us personalize your experience",
            icon: User,
        },
        {
            title: "Location",
            description: "Connect with learners in your area",
            icon: MapPin,
        },
    ];

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File too large. Please select an image smaller than 5MB");
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Invalid file type. Please select an image file");
            return;
        }

        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await apiClient.uploadProfileImage(formData);

            if (response.success) {
                setProfileData(prev => ({
                    ...prev,
                    profile_image: response.data.url
                }));
                toast.success("Profile picture uploaded successfully");
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            console.error('Image upload error:', error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleNext = () => {
        // For username step (step 2), check if username is available before proceeding
        if (currentStep === 2) {
            const username = profileData.username?.trim();

            // If username is provided, check availability
            if (username) {
                if (usernameStatus.checking) {
                    toast.error("Please wait while we check username availability");
                    return;
                }
                if (usernameStatus.available === false) {
                    toast.error("Please choose an available username or skip this step");
                    return;
                }
            }
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        setIsLoading(true);

        try {
            // Prepare the profile data
            const updateData: any = {};

            if (profileData.name?.trim()) {
                updateData.name = profileData.name.trim();
            }

            if (profileData.username?.trim()) {
                updateData.username = profileData.username.trim();
            }

            if (profileData.bio?.trim()) {
                updateData.bio = profileData.bio.trim();
            }

            if (profileData.banner_image?.trim()) {
                updateData.banner_image = profileData.banner_image.trim();
            }

            if (dateOfBirth) {
                updateData.date_of_birth = format(dateOfBirth, 'yyyy-MM-dd');
            }

            if (profileData.location?.trim()) {
                updateData.location = profileData.location.trim();
            }

            // Update profile if there's any data to update
            if (Object.keys(updateData).length > 0) {
                const response = await apiClient.updateProfile(updateData);

                if (!response.success) {
                    throw new Error(response.message || 'Failed to update profile');
                }
            }

            // Update profile completion status to 'completed'
            const statusResponse = await apiClient.updateProfileCompletionStatus('completed');
            if (!statusResponse.success) {
                console.warn('Failed to update profile completion status:', statusResponse.message);
            }

            toast.success("Profile completed! Welcome to Bitroot!");

            // Refresh profile data
            await refreshProfile();

            // Mark completion and close modal
            onComplete();
            onOpenChange(false);

        } catch (error: any) {
            console.error('Profile completion error:', error);
            toast.error(error.message || "Failed to complete profile setup");
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = async (open: boolean) => {
        if (!open) {
            // Show confirmation dialog instead of directly closing
            setShowConfirmClose(true);
            return;
        }
        onOpenChange(open);
    };

    const handleConfirmHide = async () => {
        // User chose to hide the modal permanently
        try {
            const statusResponse = await apiClient.updateProfileCompletionStatus('hidden');
            if (!statusResponse.success) {
                console.warn('Failed to update profile completion status to hidden:', statusResponse.message);
            }
        } catch (error) {
            console.warn('Error updating profile completion status to hidden:', error);
        }

        setShowConfirmClose(false);
        onOpenChange(false);
    };

    const handleCancelClose = () => {
        // User chose to continue with profile completion
        setShowConfirmClose(false);
        // Modal stays open, user continues with completion
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Profile Picture
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="w-32 h-32">
                                <AvatarImage src={profileData.profile_image || user?.profile_image} />
                                <AvatarFallback className="text-2xl">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingImage}
                                        className="w-full"
                                    >
                                        <Camera className="w-4 h-4 mr-2" />
                                        {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                                    </Button>
                                    <Button
                                        className="w-full hover:bg-primary/30"
                                        variant="outline"
                                    >
                                        <Smile className="w-4 h-4 mr-2" />
                                        Bemoji
                                    </Button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 1: // Banner Image
                return (
                    <div className="space-y-4">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">Banner Image (Optional)</h3>
                            <p className="text-muted-foreground">
                                Add a banner image to showcase your personality
                            </p>
                        </div>
                        <BannerImageUpload
                            currentBannerUrl={profileData.banner_image || user?.banner_image}
                            onBannerUpdate={(url) => setProfileData(prev => ({
                                ...prev,
                                banner_image: url
                            }))}
                        />
                    </div>
                );

            case 2: // Username
                return (
                    <div className="space-y-4">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter your display name"
                            value={profileData.name || user?.name || ''}
                            onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            This is how your name will appear to others
                        </p>
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Choose a unique username"
                                value={profileData.username || user?.username || ''}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                className={cn(
                                    usernameStatus.available === false && "border-red-500",
                                    usernameStatus.available === true && "border-green-500"
                                )}
                            />
                            {/* Username status message */}
                            {usernameStatus.message && (
                                <div className={cn(
                                    "flex items-center gap-2 text-sm mt-2",
                                    usernameStatus.checking && "text-muted-foreground",
                                    usernameStatus.available === true && "text-green-600",
                                    usernameStatus.available === false && "text-red-600"
                                )}>
                                    {usernameStatus.checking && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {usernameStatus.available === true && <Check className="w-4 h-4" />}
                                    {usernameStatus.available === false && <X className="w-4 h-4" />}
                                    <span>{usernameStatus.message}</span>
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">
                                Letters, numbers, underscores, and hyphens only (3-30 characters)
                            </p>
                        </div>
                    </div>
                );

            case 3: // Bio
                return (
                    <div className="space-y-4">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell others about yourself, your interests, or what you're learning..."
                            value={profileData.bio || user?.bio || ''}
                            onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                bio: e.target.value
                            }))}
                            className="min-h-[100px]"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Share what makes you unique and what you're passionate about
                        </p>
                    </div>
                );

            case 4: // Date of Birth
                return (
                    <div className="space-y-4">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : ''}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setDateOfBirth(new Date(e.target.value));
                                } else {
                                    setDateOfBirth(undefined);
                                }
                            }}
                            max={format(new Date(), 'yyyy-MM-dd')}
                            min="1900-01-01"
                            className="h-12"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            This helps us provide age-appropriate content and features
                        </p>
                    </div>
                );

            case 5: // Location
                return (
                    <div className="space-y-4">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            placeholder="e.g., New York, NY or London, UK"
                            value={profileData.location || ''}
                            onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                location: e.target.value
                            }))}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Connect with other learners and events in your area
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    const currentStepData = steps[currentStep];

    return (
        <>
            <Dialog open={open} onOpenChange={handleModalClose}>
                <DialogContent
                    className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            {/* <currentStepData.icon className="w-5 h-5" /> */}
                            <span>{currentStepData.title}</span>
                        </DialogTitle>
                        <DialogDescription>
                            {/* {currentStepData.description} */}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Progress indicator */}
                    <div className="flex space-x-2 mb-4">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "h-2 rounded-full flex-1 transition-colors",
                                    index <= currentStep ? "bg-primary" : "bg-muted"
                                )}
                            />
                        ))}
                    </div>

                    <div className="py-4">
                        {renderStepContent()}
                    </div>

                    <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                        <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                            {currentStep > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={handlePrevious}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto"
                                >
                                    Previous
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                onClick={handleSkip}
                                disabled={isLoading}
                                className="w-full sm:w-auto"
                            >
                                Skip
                            </Button>
                        </div>
                        <Button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="min-w-[100px] w-full sm:w-auto"
                        >
                            {isLoading ? 'Completing...' : currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Do not show again?</DialogTitle>
                        <DialogDescription>
                            You can complete your profile later from your settings. Would you like us to stop showing this reminder?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCancelClose}
                            className="w-full sm:w-auto hover:text-foreground"
                        >
                            No
                        </Button>
                        <Button
                            onClick={handleConfirmHide}
                            className="w-full sm:w-auto"
                        >
                            Yes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
