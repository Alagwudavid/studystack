"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSettingsContext } from "../TabbedSettingsLayout";
import {
  User,
  Shield,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Camera,
  Trash2,
  MapPin,
  Calendar,
  Lock,
  Check,
  X,
  Loader2,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  profile_image: string | null;
  bio: string | null;
  username?: string | null;
  date_of_birth?: string | null;
  location?: string | null;
  points: number;
  level: number;
  streak_count: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

interface AccountSettingsClientProps {
  serverUser?: User;
}

export default function AccountSettingsClient({
  serverUser,
}: AccountSettingsClientProps) {
  const { setServerUser, refreshProfile, user: contextUser } = useAuth();
  const settingsContext = useSettingsContext();

  // Use serverUser prop, or fall back to context, or auth context
  const user = serverUser || settingsContext.user || contextUser;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    dateOfBirth: user?.date_of_birth || "",
    phone: "",
  });

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
    setFormData(prev => ({ ...prev, username }));

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

  // Profile image upload
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
        // Update the server user data with new image URL
        const updatedUser = { ...user, profile_image: response.data.url };
        if (setServerUser) {
          setServerUser(updatedUser);
        }
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

  // Remove profile image
  const handleRemoveImage = async () => {
    // Add implementation for removing profile image if needed
    toast.info("Remove image functionality coming soon");
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (usernameCheckTimer) {
        clearTimeout(usernameCheckTimer);
      }
    };
  }, [usernameCheckTimer]);

  useEffect(() => {
    if (user && setServerUser) {
      setServerUser(user);
    }
  }, [user, setServerUser]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (usernameCheckTimer) {
        clearTimeout(usernameCheckTimer);
      }
    };
  }, [usernameCheckTimer]);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'username') {
      handleUsernameChange(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate username if it's changed
    if (formData.username !== user.username) {
      if (usernameStatus.checking) {
        toast.error("Please wait while we check username availability");
        return;
      }
      if (usernameStatus.available === false) {
        toast.error("Please choose an available username");
        return;
      }
    }

    setIsLoading(true);

    try {
      // Prepare the profile data
      const updateData: any = {};

      // Combine first and last name
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      if (fullName && fullName !== user.name) {
        updateData.name = fullName;
      }

      if (formData.username.trim() && formData.username.trim() !== user.username) {
        updateData.username = formData.username.trim();
      }

      if (formData.email.trim() && formData.email.trim() !== user.email) {
        updateData.email = formData.email.trim();
      }

      if (formData.bio.trim() !== (user.bio || '')) {
        updateData.bio = formData.bio.trim();
      }

      if (formData.location.trim() !== (user.location || '')) {
        updateData.location = formData.location.trim();
      }

      if (formData.dateOfBirth && formData.dateOfBirth !== user.date_of_birth) {
        updateData.date_of_birth = formData.dateOfBirth;
      }

      // Update profile if there's any data to update
      if (Object.keys(updateData).length > 0) {
        const response = await apiClient.updateProfile(updateData);

        if (!response.success) {
          throw new Error(response.message || 'Failed to update profile');
        }

        toast.success("Profile updated successfully!");

        // Refresh profile data
        if (refreshProfile) {
          await refreshProfile();
        }
      } else {
        toast.info("No changes to save");
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Type Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile information and account settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Personal</Badge>
        </div>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={user.profile_image || undefined}
                alt="Profile"
              />
              <AvatarFallback className="text-xl">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Camera className="w-4 h-4" />
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Change Photo'
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={handleRemoveImage}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Enter username"
                  className={cn(
                    usernameStatus.available === false && "border-red-500",
                    usernameStatus.available === true && "border-green-500"
                  )}
                />
                {/* Username status message */}
                {usernameStatus.message && (
                  <div className={cn(
                    "flex items-center gap-2 text-sm",
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
                <p className="text-sm text-muted-foreground">
                  Letters, numbers, underscores, and hyphens only (3-30 characters)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex">
                  <Mail className="w-4 h-4 mt-3 mr-2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center">Phone Number <Badge className="ml-2" variant="sky">Coming Soon</Badge></Label>
                <div className="flex">
                  <Phone className="w-4 h-4 mt-3 mr-2 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      handleInputChange("phone", e.target.value)
                    }
                    placeholder="Add phone number"
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex">
                  <MapPin className="w-4 h-4 mt-3 mr-2 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="Enter your location"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="flex">
                  <Calendar className="w-4 h-4 mt-3 mr-2 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    max={new Date().toISOString().split('T')[0]}
                    min="1900-01-01"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell others about yourself..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isLoading || uploadingImage || usernameStatus.checking}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Profile...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Two-Factor Authentication & Security
            </div>
            <Badge variant="sky">Coming Soon</Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enhanced security features including password management and 2FA
            will be available soon.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 opacity-60 pointer-events-none">
          {/* Password Section */}
          <div className="border rounded-lg p-4 bg-muted">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Password Management
            </h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      disabled
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    disabled
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled>
                Update Password
              </Button>
            </form>
          </div>

          {/* 2FA Section */}
          <div className="border rounded-lg p-4 bg-muted">
            <h3 className="text-sm font-semibold mb-3">
              Two-Factor Authentication
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              Add an extra layer of security to your account with 2FA.
            </p>
            <Button variant="outline" disabled className="w-full">
              Setup Two-Factor Authentication
            </Button>
          </div>

          {/* Login Sessions */}
          <div className="border rounded-lg p-4 bg-muted">
            <h3 className="text-sm font-semibold mb-3">Active Sessions</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              Manage devices that are currently logged into your account.
            </p>
            <Button variant="outline" disabled className="w-full">
              View Active Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
