'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, X, Edit2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import ImageEditor from './ImageEditor';

interface ProfileImageUploadProps {
    currentProfileUrl?: string;
    onProfileUpdate: (url: string) => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    userInitials?: string;
}

const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
};

export default function ProfileImageUpload({
    currentProfileUrl,
    onProfileUpdate,
    className = '',
    size = 'lg',
    userInitials = 'U'
}: ProfileImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, or GIF)');
            return;
        }

        // Validate file size (5MB max for profile images)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setSelectedFile(file);
        setShowEditor(true);

        // Reset the input
        event.target.value = '';
    };

    const handleSaveEditedImage = async (editedFile: File) => {
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', editedFile);

            const response = await apiClient.uploadProfileImage(formData);

            if (response.success) {
                onProfileUpdate(response.data.url);
                toast.success("Profile image uploaded successfully");
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to upload profile image");
        } finally {
            setUploading(false);
            setShowEditor(false);
            setSelectedFile(null);
        }
    };

    const removeProfileImage = () => {
        onProfileUpdate('');
        toast.success('Profile image removed');
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="space-y-2">
                <label className="text-sm font-medium">Profile Image</label>
                <p className="text-xs text-muted-foreground">
                    Upload a profile picture (recommended: square image, max 5MB)
                </p>
            </div>

            {/* Profile Image Preview */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                    <Avatar className={`${sizeClasses[size]} border-4 border-white shadow-lg`}>
                        {currentProfileUrl ? (
                            <AvatarImage
                                src={currentProfileUrl}
                                alt="Profile preview"
                                className="object-cover"
                            />
                        ) : (
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                                {userInitials}
                            </AvatarFallback>
                        )}
                    </Avatar>

                    {/* Overlay for edit/remove actions */}
                    {currentProfileUrl && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => document.getElementById('profile-upload-input')?.click()}
                                    disabled={uploading}
                                    className="h-8 w-8 p-0"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={removeProfileImage}
                                    disabled={uploading}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <Button
                    variant={currentProfileUrl ? "outline" : "default"}
                    onClick={() => document.getElementById('profile-upload-input')?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2"
                >
                    {uploading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            {currentProfileUrl ? (
                                <>
                                    <Edit2 className="w-4 h-4" />
                                    Change Photo
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Upload Photo
                                </>
                            )}
                        </>
                    )}
                </Button>

                <input
                    id="profile-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                />
            </div>

            {/* Image Editor Modal */}
            {selectedFile && (
                <ImageEditor
                    isOpen={showEditor}
                    onClose={() => {
                        setShowEditor(false);
                        setSelectedFile(null);
                    }}
                    imageFile={selectedFile}
                    aspectRatio={1} // Square aspect ratio for profile images
                    minWidth={150}
                    minHeight={150}
                    maxWidth={400}
                    maxHeight={400}
                    isCircular={true}
                    onSave={handleSaveEditedImage}
                />
            )}
        </div>
    );
}