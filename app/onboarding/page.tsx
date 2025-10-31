"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    User,
    Building2,
    ArrowRight,
    ArrowLeft,
    Camera,
    Check,
    X,
    Loader2,
    Smile,
    Tags,
    MapPin,
    Sparkles,
    Target,
    Shield
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Interest, getSuggestedInterests, searchInterests, getInterestById, getSuggestedDatabaseInterests, searchDatabaseInterests, getInterestByDatabaseId } from "@/data/personal-interests";
import { getPostLoginRedirectUrl } from "@/lib/fallback-url";
import BannerImageUpload from "@/components/BannerImageUpload";

type AccountType = "personal" | "business" | null;

// Professional categories
const professionalCategories = [
    {
        group: "🎓 Education & Training",
        categories: [
            "Teacher / Educator",
            "Professor / Academic",
            "Tutor / Instructor",
            "Trainer / Coach",
            "Educational Consultant"
        ]
    },
    {
        group: "🌍 Language & Culture",
        categories: [
            "Language Teacher / Instructor",
            "Translator / Interpreter",
            "Linguist / Language Researcher",
            "Cultural Expert / Ambassador"
        ]
    },
    {
        group: "📚 Learning & Content",
        categories: [
            "Student / Learner",
            "Content Creator",
            "Author / Writer",
            "Course Creator"
        ]
    },
    {
        group: "🌍 Culture & Community",
        categories: [
            "Cultural Expert",
            "Historian / Anthropologist",
            "Community Leader",
            "Non-profit / NGO"
        ]
    },
    {
        group: "💼 Professional Skills",
        categories: [
            "Business Professional",
            "Freelancer",
            "Consultant",
            "Entrepreneur / Startup Founder"
        ]
    },
    {
        group: "🏫 Education",
        categories: [
            "School (Primary / Secondary)",
            "University / College",
            "Training Center / Academy",
            "Online Learning Platform"
        ]
    },
    {
        group: "🌍 Culture & Community",
        categories: [
            "Cultural Institution (Museum / Library / Arts)",
            "Non-profit / NGO",
            "Community Organization"
        ]
    },
    {
        group: "💼 Business & Technology",
        categories: [
            "Corporate Training",
            "EdTech Company",
            "Consulting Firm",
            "Technology Company"
        ]
    }
];

interface OnboardingData {
    account_type?: AccountType;
    profile_image?: string;
    banner_image?: string;
    name?: string;
    username?: string;
    bio?: string;
    date_of_birth?: string;
    location?: string;
    selected_interests: number[]; // Changed to array of database IDs
    // Business specific fields
    credentials?: string;
    professional_category?: string;
    organization?: string;
    website?: string;
}

export default function OnboardingPage() {
    const router = useRouter();
    const { user, refreshProfile, authenticatedAction, isLoading: authLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({
        selected_interests: []
    });
    const [dateOfBirth, setDateOfBirth] = useState<Date>();
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showSkipConfirm, setShowSkipConfirm] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Interest selection state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Interest[]>([]);
    const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
    const [suggestedInterests, setSuggestedInterests] = useState<Interest[]>([]);
    const [loadingInterests, setLoadingInterests] = useState(false);
    const [addingCustomInterest, setAddingCustomInterest] = useState(false);

    const steps = [
        {
            title: "Account Type",
            description: "Choose your account type",
            icon: User,
        },
        {
            title: "Profile Photo",
            description: "Add your profile picture",
            icon: Camera,
        },
        {
            title: "Account Details",
            description: "Tell us about yourself",
            icon: User,
        },
        {
            title: "Interests",
            description: "Select your interests (Personal only)",
            icon: Tags,
        },
        {
            title: "Complete Setup",
            description: "Finish your profile",
            icon: MapPin,
        }
    ];

    // Filter steps based on account type
    const getActiveSteps = () => {
        if (onboardingData.account_type === "personal") {
            return steps; // All steps for personal
        } else if (onboardingData.account_type === "business") {
            return steps.filter(step => step.title !== "Interests"); // Skip interests for business
        }
        return [steps[0]]; // Only account type selection if no type selected
    };

    const activeSteps = getActiveSteps();

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
        setOnboardingData(prev => ({ ...prev, username }));

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

    // Auto-fill existing user data when component loads
    useEffect(() => {
        if (user && !onboardingData.name && !onboardingData.username) {
            const existingDate = user.date_of_birth ? new Date(user.date_of_birth) : undefined;

            setOnboardingData(prev => ({
                ...prev,
                name: user.name || '',
                username: user.username || '',
                bio: user.bio || '',
                location: user.location || '',
                profile_image: user.profile_image || ''
            }));

            if (existingDate && !isNaN(existingDate.getTime())) {
                setDateOfBirth(existingDate);
            }
        }
    }, [user]);

    const handleAccountTypeSelect = (type: AccountType) => {
        setOnboardingData(prev => ({ ...prev, account_type: type }));
        // Reset step to account type when changing type
        if (currentStep > 0) {
            setCurrentStep(0);
        }
    };

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
                setOnboardingData(prev => ({
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

    const handleInterestToggle = (interestId: number) => {
        setOnboardingData(prev => ({
            ...prev,
            selected_interests: prev.selected_interests.includes(interestId)
                ? prev.selected_interests.filter(id => id !== interestId)
                : [...prev.selected_interests, interestId]
        }));
    };

    // Load interests from database
    const loadInterests = useCallback(async () => {
        setLoadingInterests(true);
        try {
            // Load all interests
            const allInterestsResponse = await apiClient.getInterests();
            if (allInterestsResponse.success) {
                setAvailableInterests(allInterestsResponse.data);

                // Filter suggested interests
                const suggested = getSuggestedDatabaseInterests(allInterestsResponse.data);
                setSuggestedInterests(suggested);
            } else {
                console.error('Failed to load interests:', allInterestsResponse.message);
                toast.error('Failed to load interests');
            }
        } catch (error) {
            console.error('Error loading interests:', error);
            toast.error('Failed to load interests');
        } finally {
            setLoadingInterests(false);
        }
    }, []);

    // Load interests when component mounts or when account type becomes personal
    useEffect(() => {
        if (onboardingData.account_type === 'personal') {
            loadInterests();
        }
    }, [onboardingData.account_type, loadInterests]);

    // Handle search input for database interests
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (value.trim()) {
            const results = searchDatabaseInterests(availableInterests, value);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    // Add custom interest
    const handleAddCustomInterest = async (label: string) => {
        if (!label.trim() || addingCustomInterest) return;

        setAddingCustomInterest(true);
        try {
            const response = await apiClient.addCustomInterest(label.trim());
            if (response.success) {
                // Add the new interest to available interests
                setAvailableInterests(prev => [...prev, response.data]);

                // Auto-select the new interest
                setOnboardingData(prev => ({
                    ...prev,
                    selected_interests: [...prev.selected_interests, response.data.id]
                }));

                // Clear search to show the newly added interest
                setSearchQuery('');
                setSearchResults([]);

                toast.success(`"${label}" added to your interests!`);
            } else {
                if (response.requiresAuth) {
                    // Handle authentication required case
                    toast.error('Please continue with existing interests for now. You can add custom interests after completing the onboarding.');
                } else if (response.message?.includes('already exists')) {
                    toast.error(`"${label}" already exists as an interest`);
                } else {
                    toast.error(response.message || 'Failed to add custom interest');
                }
            }
        } catch (error: any) {
            console.error('Error adding custom interest:', error);
            if (error.message?.includes('Authentication') || error.message?.includes('Authorization')) {
                toast.error('Please continue with existing interests for now. You can add custom interests after completing the onboarding.');
            } else {
                toast.error('Failed to add custom interest');
            }
        } finally {
            setAddingCustomInterest(false);
        }
    };

    // Save step data to backend
    const saveStepData = async (stepData: Partial<OnboardingData>) => {
        try {
            // Prepare onboarding payload
            const onboardingPayload: any = {
                completion_step: `step_${currentStep}`,
                ...stepData
            };

            // Also prepare profile data for user table
            const profileUpdateData: any = {};
            if (stepData.name?.trim()) {
                profileUpdateData.name = stepData.name.trim();
            }
            if (stepData.username?.trim()) {
                profileUpdateData.username = stepData.username.trim();
            }

            // Update profile if there's profile data
            if (Object.keys(profileUpdateData).length > 0) {
                const profileResponse = await apiClient.updateProfile(profileUpdateData);
                if (!profileResponse.success) {
                    console.warn('Failed to update profile:', profileResponse.message);
                }
            }

            // Save to onboarding table
            const onboardingResponse = await apiClient.updateOnboarding(onboardingPayload);
            if (!onboardingResponse.success) {
                console.warn('Failed to save step data:', onboardingResponse.message);
            }
        } catch (error) {
            console.warn('Error saving step data:', error);
        }
    };

    const handleNext = async () => {
        // Validate required fields for current step
        if (currentStep === 0 && !onboardingData.account_type) {
            toast.error("Please select an account type");
            return;
        }

        // For username step (step 2), check if username is available before proceeding
        if (currentStep === 2) {
            const username = onboardingData.username?.trim();

            // If username is provided, check availability
            if (username) {
                if (usernameStatus.checking) {
                    toast.error("Please wait while we check username availability");
                    return;
                }
                if (usernameStatus.available === false) {
                    toast.error("Please choose an available username or leave it empty");
                    return;
                }
            }
        }

        // Save current step data before moving to next
        const stepData: Partial<OnboardingData> = {};

        if (currentStep === 0) {
            stepData.account_type = onboardingData.account_type;
        } else if (currentStep === 1) {
            stepData.profile_image = onboardingData.profile_image;
            stepData.banner_image = onboardingData.banner_image;
        } else if (currentStep === 2) {
            stepData.name = onboardingData.name;
            stepData.username = onboardingData.username;
        } else if (currentStep === 3 && onboardingData.account_type === "personal") {
            stepData.selected_interests = onboardingData.selected_interests;
        }

        await saveStepData(stepData);

        if (currentStep < activeSteps.length - 1) {
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

    const handleComplete = async () => {
        setIsLoading(true);

        try {
            console.log('Starting onboarding completion...');
            console.log('User state:', { userId: user?.id, isAuthenticated: !!user });
            console.log('Onboarding data:', onboardingData);

            // Validate required data
            if (!onboardingData.account_type) {
                throw new Error('Account type is required to complete onboarding');
            }

            // Prepare the onboarding data for the onboarding table
            const onboardingPayload: any = {
                account_type: onboardingData.account_type,
                is_completed: true,
                completion_step: 'completed'
            };

            // Add account type specific fields
            if (onboardingData.account_type === 'personal') {
                // Note: We no longer save interests to the onboarding table
                // Instead we save them to the user_interests pivot table below
            } else if (onboardingData.account_type === 'business') {
                // Business specific fields
                if (onboardingData.organization?.trim()) {
                    onboardingPayload.organization = onboardingData.organization.trim();
                }
                if (onboardingData.website?.trim()) {
                    let website = onboardingData.website.trim();
                    // Ensure website has proper protocol
                    if (!website.startsWith('http://') && !website.startsWith('https://')) {
                        website = 'https://' + website;
                    }
                    onboardingPayload.website = website;
                }
                if (onboardingData.credentials?.trim()) {
                    onboardingPayload.credentials = onboardingData.credentials.trim();
                }
                if (onboardingData.professional_category?.trim()) {
                    onboardingPayload.professional_category = onboardingData.professional_category.trim();
                }
                // Include banner_image in onboarding payload
                if (onboardingData.banner_image?.trim()) {
                    onboardingPayload.banner_image = onboardingData.banner_image.trim();
                }
            }

            // Add common fields
            if (onboardingData.bio?.trim()) {
                onboardingPayload.bio = onboardingData.bio.trim();
            }

            if (dateOfBirth) {
                try {
                    const formattedDate = format(dateOfBirth, 'yyyy-MM-dd');
                    // Validate date is not in the future and not too far in the past
                    const currentDate = new Date();
                    const minDate = new Date(currentDate.getFullYear() - 120, 0, 1); // 120 years ago

                    if (dateOfBirth <= currentDate && dateOfBirth >= minDate) {
                        onboardingPayload.date_of_birth = formattedDate;
                    } else {
                        console.warn('Date of birth is invalid (future date or too old), skipping');
                    }
                } catch (error) {
                    console.warn('Invalid date format, skipping date_of_birth:', error);
                }
            }

            if (onboardingData.location?.trim()) {
                onboardingPayload.location = onboardingData.location.trim();
            }

            // Prepare comprehensive profile data for the users table
            const profileUpdateData: any = {};

            // Basic profile fields
            if (onboardingData.name?.trim()) {
                profileUpdateData.name = onboardingData.name.trim();
            }

            if (onboardingData.username?.trim()) {
                profileUpdateData.username = onboardingData.username.trim();
            }

            if (onboardingData.bio?.trim()) {
                profileUpdateData.bio = onboardingData.bio.trim();
            }

            if (onboardingData.location?.trim()) {
                profileUpdateData.location = onboardingData.location.trim();
            }

            // Profile image
            if (onboardingData.profile_image?.trim()) {
                profileUpdateData.profile_image = onboardingData.profile_image.trim();
            }

            // Date of birth
            if (dateOfBirth) {
                try {
                    const formattedDate = format(dateOfBirth, 'yyyy-MM-dd');
                    const currentDate = new Date();
                    const minDate = new Date(currentDate.getFullYear() - 120, 0, 1);

                    if (dateOfBirth <= currentDate && dateOfBirth >= minDate) {
                        profileUpdateData.date_of_birth = formattedDate;
                    }
                } catch (error) {
                    console.warn('Invalid date format for profile, skipping date_of_birth:', error);
                }
            }

            // Banner image (available for all account types)
            if (onboardingData.banner_image?.trim()) {
                profileUpdateData.banner_image = onboardingData.banner_image.trim();
            }

            // Business-specific profile fields
            if (onboardingData.account_type === 'business') {
                // Set is_professional to true for business accounts
                profileUpdateData.is_professional = true;
                // Set account_type in profile as well
                profileUpdateData.account_type = 'business';

                if (onboardingData.organization?.trim()) {
                    profileUpdateData.organization = onboardingData.organization.trim();
                }

                if (onboardingData.website?.trim()) {
                    let website = onboardingData.website.trim();
                    if (!website.startsWith('http://') && !website.startsWith('https://')) {
                        website = 'https://' + website;
                    }
                    profileUpdateData.website = website;
                }

                if (onboardingData.professional_category?.trim()) {
                    profileUpdateData.professional_category = onboardingData.professional_category.trim();
                }
            } else {
                // For personal accounts, ensure is_professional is false
                profileUpdateData.is_professional = false;
                profileUpdateData.account_type = 'personal';
            }

            // Mark user as having completed onboarding
            profileUpdateData.is_onboarded_status = 'complete';

            // Update profile with basic user data
            if (Object.keys(profileUpdateData).length > 0) {
                console.log('Updating profile with data:', profileUpdateData);
                try {
                    const response = await apiClient.updateProfile(profileUpdateData);

                    if (!response.success) {
                        throw new Error(response.message || 'Failed to update profile');
                    }
                    console.log('Profile updated successfully');
                } catch (error: any) {
                    console.error('Profile update failed:', error);
                    throw new Error(`Profile update failed: ${error.message || 'Unknown error'}`);
                }
            }

            // Update profile completion status to 'completed'
            try {
                console.log('Updating profile completion status to completed...');
                const statusResponse = await apiClient.updateProfileCompletionStatus('completed');
                if (!statusResponse.success) {
                    console.warn('Failed to update profile completion status:', statusResponse.message);
                } else {
                    console.log('Profile completion status updated successfully');
                }
            } catch (error) {
                console.warn('Error updating profile completion status:', error);
            }

            // Save onboarding data to onboarding table
            console.log('Saving onboarding data:', onboardingPayload);

            // Log each field for debugging
            console.log('Payload fields:', {
                account_type: onboardingPayload.account_type,
                is_completed: onboardingPayload.is_completed,
                completion_step: onboardingPayload.completion_step,
                organization: onboardingPayload.organization,
                website: onboardingPayload.website,
                date_of_birth: onboardingPayload.date_of_birth,
                location: onboardingPayload.location,
                bio: onboardingPayload.bio,
                credentials: onboardingPayload.credentials,
                professional_category: onboardingPayload.professional_category
            });

            try {
                const onboardingResponse = await apiClient.updateOnboarding(onboardingPayload);
                if (!onboardingResponse.success) {
                    throw new Error(onboardingResponse.message || 'Failed to save onboarding data');
                }
                console.log('Onboarding data saved successfully');
            } catch (error: any) {
                console.error('Onboarding data save failed:', error);
                console.error('Failed payload:', onboardingPayload);
                throw new Error(`Onboarding save failed: ${error.message || 'Unknown error'}`);
            }

            // Save user interests to the pivot table (for personal accounts)
            if (onboardingData.account_type === 'personal' && onboardingData.selected_interests.length > 0) {
                try {
                    console.log('Saving user interests:', onboardingData.selected_interests);
                    const interestsResponse = await apiClient.updateUserInterests(onboardingData.selected_interests);
                    if (!interestsResponse.success) {
                        console.warn('Failed to save user interests:', interestsResponse.message);
                        // Don't block onboarding completion if interests saving fails
                    } else {
                        console.log('User interests saved successfully');
                    }
                } catch (error) {
                    console.warn('Error saving user interests:', error);
                    // Don't block onboarding completion if interests saving fails
                }
            }

            // For business accounts with credentials, apply for professional profile
            let professionalApplicationSubmitted = false;
            if (onboardingData.account_type === 'business' && onboardingData.credentials?.trim() && onboardingData.professional_category) {
                try {
                    const professionalResponse = await apiClient.applyProfessionalProfile({
                        credentials: onboardingData.credentials.trim(),
                        switch_to_professional: true,
                        professional_category: onboardingData.professional_category,
                    });

                    if (professionalResponse.success) {
                        professionalApplicationSubmitted = true;
                        toast.success(`Professional application submitted! Application ID: ${professionalResponse.application_id}`);
                    }
                } catch (error) {
                    console.warn('Professional profile application failed:', error);
                    // Don't block onboarding completion if professional application fails
                }
            }

            // Show appropriate success message
            let welcomeMessage;
            if (onboardingData.account_type === 'business') {
                welcomeMessage = professionalApplicationSubmitted
                    ? "Welcome to Bitroot! Your business account is ready and professional application submitted!"
                    : "Welcome to Bitroot! Your business account is ready!";
            } else {
                welcomeMessage = "Welcome to Bitroot! Your personal account is ready!";
            }

            toast.success(welcomeMessage);

            // Refresh profile data to ensure all updates are reflected
            console.log('Refreshing profile data...');
            try {
                await refreshProfile();
                console.log('Profile data refreshed successfully');
            } catch (error) {
                console.warn('Failed to refresh profile data:', error);
            }

            // For business accounts, redirect to verify-business if they want to verify later
            if (onboardingData.account_type === 'business' && !professionalApplicationSubmitted) {
                // Could redirect to verify-business or just go to main app
                const redirectUrl = getPostLoginRedirectUrl();
                router.push(redirectUrl);
            } else {
                // Get fallback URL or default to home
                const redirectUrl = getPostLoginRedirectUrl();
                console.log('Redirecting to:', redirectUrl);
                router.push(redirectUrl);
            }

        } catch (error: any) {
            console.error('Onboarding completion error:', error);
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                status: error.status,
                response: error.response,
                stack: error.stack
            });
            toast.error(error.message || "Failed to complete onboarding");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle skip onboarding
    const handleSkipOnboarding = () => {
        // Check if user is authenticated before showing skip confirmation
        if (!user) {
            toast.error("Authentication required. Please log in first.");
            router.push('/auth');
            return;
        }
        setShowSkipConfirm(true);
    };

    const handleConfirmSkip = async () => {
        setIsSkipping(true);
        try {
            console.log('Attempting to skip onboarding. User:', {
                id: user?.id,
                email: user?.email,
                isAuthenticated: !!user
            });

            // Check if user is authenticated before proceeding
            if (!user) {
                throw new Error('You must be logged in to skip onboarding');
            }

            // Use authenticatedAction to ensure proper authentication
            await authenticatedAction(async () => {
                console.log('Inside authenticated action, calling updateOnboardingStatus...');

                // Set onboarding status to 'skipped'
                const response = await apiClient.updateOnboardingStatus('skipped');

                console.log('UpdateOnboardingStatus response:', response);

                if (response.success) {
                    toast.success("Onboarding skipped. You can complete it later from your profile.");

                    // Get fallback URL or default to home
                    const redirectUrl = getPostLoginRedirectUrl();
                    console.log('Redirecting to:', redirectUrl);
                    router.push(redirectUrl);
                } else {
                    throw new Error(response.message || 'Failed to skip onboarding');
                }
            });
        } catch (error: any) {
            console.error('Error skipping onboarding:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.status,
                name: error.name
            });

            // Provide more specific error messages
            if (error.message?.includes('Session expired') ||
                error.message?.includes('Authentication required')) {
                toast.error("Your session has expired. Please log in again.");
                router.push('/auth');
            } else {
                toast.error(error.message || "Failed to skip onboarding. Please try again.");
            }
        } finally {
            setIsSkipping(false);
            setShowSkipConfirm(false);
        }
    };

    const handleCancelSkip = () => {
        setShowSkipConfirm(false);
    };

    const renderStepContent = () => {
        // Map current step index to actual step based on account type
        let actualStepIndex = currentStep;

        // For business accounts, if we're past step 2 (Account Details), 
        // we need to skip the Interests step (step 3) and go to Complete Setup (step 4)
        if (onboardingData.account_type === "business" && currentStep >= 3) {
            actualStepIndex = currentStep + 1; // Skip interests step (3) and go to Complete Setup (4)
        }

        switch (actualStepIndex) {
            case 0: // Account Type Selection
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mb-2">Account type</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Personal Account */}
                            <Card
                                className={cn(
                                    "cursor-pointer transition-all duration-200 hover:scale-105",
                                    onboardingData.account_type === "personal"
                                        ? "ring-2 ring-primary bg-primary/5"
                                        : "bg-muted"
                                )}
                                onClick={() => handleAccountTypeSelect("personal")}
                            >
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                        <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="text-xl">Personal</CardTitle>
                                    <CardDescription className="text-center">
                                        Perfect for individual learners exploring topics and events
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {/* Business Account */}
                            <Card
                                className={cn(
                                    "cursor-pointer transition-all duration-200 hover:scale-105",
                                    onboardingData.account_type === "business"
                                        ? "ring-2 ring-primary bg-primary/5"
                                        : "bg-muted"
                                )}
                                onClick={() => handleAccountTypeSelect("business")}
                            >
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                        <Building2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <CardTitle className="text-xl">Business</CardTitle>
                                    <CardDescription className="text-center">
                                        Ideal for educators, institutions, and professionals
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                );

            case 1: // Profile Photo & Banner (Business accounts get banner too)
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">Profile Upload</h3>
                        </div>

                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="w-32 h-32">
                                <AvatarImage src={onboardingData.profile_image || user?.profile_image || undefined} />
                                <AvatarFallback className="text-2xl">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingImage}
                                        className="w-full text-foreground rounded-full p-2 bg-card"
                                    >
                                        <Camera className="!size-6" />
                                    </Button>
                                    <Button
                                        className="w-full rounded-full p-2 hover:bg-primary/30 cursor-not-allowed"
                                        variant="outline"
                                    >
                                        <Smile className="!size-6" />
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

                        {uploadingImage && (
                            <span className="text-muted-foreground text-sm text-center">
                                Uploading
                            </span>
                        )}

                        {/* Banner Image Section (Available for all account types) */}
                        <div className="space-y-4">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">Banner Image (Optional)</h3>
                                <p className="text-muted-foreground">
                                    Add a banner image to showcase your personality
                                </p>
                            </div>
                            <BannerImageUpload
                                currentBannerUrl={onboardingData.banner_image}
                                onBannerUpdate={(url) => setOnboardingData(prev => ({
                                    ...prev,
                                    banner_image: url
                                }))}
                            />
                        </div>
                    </div>
                );

            case 2: // Account Details (Name, Username, Bio, etc.)
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter your display name"
                                value={onboardingData.name || user?.name || ''}
                                onChange={(e) => setOnboardingData(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                            />
                        </div>

                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Choose a unique username"
                                value={onboardingData.username || user?.username || ''}
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

                        <div className="space-y-4">
                            <Label htmlFor="bio">Bio (Optional)</Label>
                            <Textarea
                                id="bio"
                                placeholder={onboardingData.account_type === 'business'
                                    ? "Tell others about your professional background, expertise, or what you're passionate about teaching..."
                                    : "Tell others about yourself, your interests, or what you're learning..."
                                }
                                value={onboardingData.bio || user?.bio || ''}
                                onChange={(e) => setOnboardingData(prev => ({
                                    ...prev,
                                    bio: e.target.value
                                }))}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Date of Birth (Optional)</Label>
                                <Input
                                    id="date_of_birth"
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
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location (Optional)</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., New York, NY"
                                    value={onboardingData.location || ''}
                                    onChange={(e) => setOnboardingData(prev => ({
                                        ...prev,
                                        location: e.target.value
                                    }))}
                                />
                            </div>
                        </div>

                        {/* Business-specific fields */}
                        {onboardingData.account_type === 'business' && (
                            <div className="space-y-4 border-t pt-4">
                                <h4 className="font-medium">Business Information (Optional)</h4>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="organization">Organization</Label>
                                        <Input
                                            id="organization"
                                            placeholder="Company, school, institution, or organization"
                                            value={onboardingData.organization || ''}
                                            onChange={(e) => setOnboardingData(prev => ({ ...prev, organization: e.target.value }))}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            placeholder="https://yourwebsite.com"
                                            value={onboardingData.website || ''}
                                            onChange={(e) => setOnboardingData(prev => ({ ...prev, website: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 3: // Interests (Personal only)
                if (onboardingData.account_type !== 'personal') {
                    return null; // Should not reach here for business accounts
                }

                const displayedInterests = searchQuery.trim() ? searchResults : suggestedInterests;

                return (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">What interests you?</h3>
                            <p className="text-muted-foreground">
                                Select from available interests below (minimum 3)
                            </p>
                            <p className="text-xs text-muted-foreground">
                                💡 You can add custom interests after completing onboarding
                            </p>
                        </div>

                        {/* Loading state */}
                        {loadingInterests && (
                            <div className="text-center">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                <p className="text-sm text-muted-foreground mt-2">Loading interests...</p>
                            </div>
                        )}

                        {!loadingInterests && (
                            <>
                                {/* Search */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Input
                                            placeholder="Search through available interests..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="w-full"
                                            disabled={addingCustomInterest}
                                        />
                                        {addingCustomInterest && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Add custom interest button */}
                                    {searchQuery.trim() && searchResults.length === 0 && (
                                        <div className="space-y-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleAddCustomInterest(searchQuery)}
                                                disabled={addingCustomInterest}
                                                className="w-full"
                                            >
                                                {addingCustomInterest ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                        Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        Try adding "{searchQuery}" as custom interest
                                                    </>
                                                )}
                                            </Button>
                                            <p className="text-xs text-muted-foreground text-center">
                                                Note: Custom interests require account completion
                                            </p>
                                        </div>
                                    )}

                                    {searchQuery.trim() && (
                                        <p className="text-sm text-muted-foreground">
                                            {searchResults.length > 0
                                                ? `Found ${searchResults.length} interest${searchResults.length === 1 ? '' : 's'} matching "${searchQuery}"`
                                                : `No interests found for "${searchQuery}". You can add it as a new interest above.`
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Selected interests */}
                                {onboardingData.selected_interests.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Selected Interests ({onboardingData.selected_interests.length})</Label>
                                        <div className="flex flex-wrap gap-2 overflow-y-auto">
                                            {onboardingData.selected_interests.map((interestId) => {
                                                const interest = getInterestByDatabaseId(availableInterests, interestId);
                                                if (!interest) return null;
                                                return (
                                                    <Badge
                                                        key={interestId}
                                                        variant="default"
                                                        className="cursor-pointer p-2"
                                                        onClick={() => handleInterestToggle(interestId)}
                                                    >
                                                        {interest.label}
                                                        {interest.is_added_by_user && (
                                                            <span className="ml-1 text-xs opacity-75">(custom)</span>
                                                        )}
                                                        <X className="w-4 h-4 ml-1" />
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Available interests */}
                                <div className="space-y-4 max-h-64 overflow-y-auto">
                                    {!searchQuery.trim() && (
                                        <div className="space-y-2">
                                            <Label className="sr-only">Suggested Interests</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Popular topics to get you started
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        {displayedInterests.map((interest) => {
                                            const isSelected = onboardingData.selected_interests.includes(interest.id);

                                            return (
                                                <Badge
                                                    key={interest.id}
                                                    variant={isSelected ? "default" : "outline"}
                                                    className="cursor-pointer transition-all hover:bg-muted p-2"
                                                    onClick={() => handleInterestToggle(interest.id)}
                                                >
                                                    {interest.label}
                                                    {interest.is_added_by_user && (
                                                        <span className="ml-1 text-xs opacity-75">(custom)</span>
                                                    )}
                                                    {isSelected && <Check className="w-4 h-4 ml-1" />}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );

            case 4: // Complete Setup (Business professional details if needed)
                return (
                    <div className="space-y-6">
                        {onboardingData.account_type === 'business' ? (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold">Professional Verification (Optional)</h3>
                                    <p className="text-muted-foreground">
                                        Get verified to unlock advanced business features
                                    </p>
                                </div>

                                {/* Benefits Section */}
                                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Professional Verification Benefits
                                    </h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                            Verified professional badge
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                            Advanced analytics and insights
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                            Priority in search results
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                            Create and manage courses
                                        </li>
                                    </ul>
                                </div>

                                {/* Professional Category */}
                                <div className="space-y-3">
                                    <Label htmlFor="category" className="text-foreground font-medium">
                                        Professional Category
                                    </Label>
                                    <Select value={onboardingData.professional_category} onValueChange={(value) => setOnboardingData(prev => ({ ...prev, professional_category: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your professional category" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {professionalCategories.map((group, groupIndex) => (
                                                <div key={groupIndex}>
                                                    <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b">
                                                        {group.group}
                                                    </div>
                                                    {group.categories.map((category) => (
                                                        <SelectItem
                                                            key={category}
                                                            value={category}
                                                            className="pl-4"
                                                        >
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Professional Credentials */}
                                <div className="space-y-3">
                                    <Label htmlFor="credentials" className="text-foreground font-medium">
                                        Professional Credentials
                                    </Label>
                                    <Textarea
                                        id="credentials"
                                        placeholder="Please provide details about your professional background, qualifications, experience, and credentials. Include relevant certifications, degrees, work experience, or other qualifications that support your professional status."
                                        value={onboardingData.credentials || ''}
                                        onChange={(e) => setOnboardingData(prev => ({ ...prev, credentials: e.target.value }))}
                                        rows={6}
                                        className="resize-none"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Provide detailed information about your professional background for verification.
                                    </p>
                                </div>

                                {onboardingData.credentials && onboardingData.professional_category && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-blue-900 dark:text-blue-100">
                                                    Professional Verification
                                                </p>
                                                <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                                                    Your credentials will be reviewed for professional verification. You'll receive an email update within 3-5 business days.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="text-center text-sm text-muted-foreground">
                                    You can skip this step and apply for verification later from your profile settings.
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold">You're all set!</h3>
                                <p className="text-muted-foreground">
                                    Click Complete to start your Bitroot journey!
                                </p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {authLoading ? (
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                    <p className="text-muted-foreground">Loading your profile...</p>
                </div>
            ) : (
                <div className="w-full max-w-2xl space-y-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/home')}
                        className="text-muted-foreground hover:text-foreground hover:bg-card"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"><path d="M3.837 12.797h6.326c.67 0 1.24-.489 1.341-1.15c.162-1.052.2-2.118.112-3.177h1.224a.5.5 0 0 0 .422-.768l-.212-.333a20 20 0 0 0-4.785-5.205l-.66-.5a1 1 0 0 0-1.21 0l-.66.5A20 20 0 0 0 .95 7.37l-.212.333a.5.5 0 0 0 .422.768h1.224a13.6 13.6 0 0 0 .112 3.176c.102.662.671 1.15 1.34 1.15" /><path d="M7 8.089c.921 0 1.668.746 1.668 1.667v3.04H5.333v-3.04c0-.92.746-1.667 1.667-1.667" /></g></svg>
                        Home
                    </Button>
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground text-lg">
                            Let's set up your account to give you the best experience
                        </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex justify-center">
                        <div className="flex space-x-2">
                            {activeSteps.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "h-2 rounded-full transition-colors",
                                        index <= currentStep ? "bg-primary" : "bg-card",
                                        activeSteps.length === 4 ? "w-8" : "w-6"
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Step content */}
                    <Card className="bg-transparent shadow-none border-none">
                        <CardHeader className="text-center space-y-4 sr-only">
                            <div className="flex items-center justify-center space-x-2">
                                {React.createElement(activeSteps[currentStep]?.icon || User, { className: "w-6 h-6 text-primary" })}
                                <CardTitle className="text-2xl">{activeSteps[currentStep]?.title}</CardTitle>
                            </div>
                            <CardDescription>
                                Step {currentStep + 1} of {activeSteps.length}: {activeSteps[currentStep]?.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {renderStepContent()}

                            {/* Navigation buttons */}
                            <div className="flex justify-between pt-6">
                                <div className="flex space-x-2">
                                    {currentStep > 0 && (
                                        <Button
                                            variant="outline"
                                            onClick={handlePrevious}
                                            disabled={isLoading}
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Previous
                                        </Button>
                                    )}
                                    {user && (
                                        <Button
                                            variant="ghost"
                                            onClick={handleSkipOnboarding}
                                            disabled={isLoading}
                                            className="text-muted-foreground hover:text-foreground hover:bg-card"
                                        >
                                            Skip for now
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        isLoading ||
                                        (currentStep === 0 && !onboardingData.account_type)
                                    }
                                    className="min-w-[120px]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : currentStep === activeSteps.length - 1 ? (
                                        <>
                                            Complete
                                            <Check className="w-4 h-4 ml-2" />
                                        </>
                                    ) : (
                                        <>
                                            Next
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skip Confirmation Dialog */}
                    <Dialog open={showSkipConfirm} onOpenChange={setShowSkipConfirm}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Are you sure you want to skip onboarding?</DialogTitle>
                                <DialogDescription>
                                    You won't see this page again. You can still complete your profile later from your settings.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancelSkip}
                                    className="w-full sm:w-auto hover:text-foreground"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConfirmSkip}
                                    disabled={isSkipping}
                                    className="w-full sm:w-auto"
                                >
                                    {isSkipping ? "Skipping..." : "Yes, skip"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
}