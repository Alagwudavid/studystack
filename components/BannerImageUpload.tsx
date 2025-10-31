'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Banner, BannerImage, BannerFallback } from '@/components/ui/banner';
import { Camera, Upload, X, Edit2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import ImageEditor from './ImageEditor';

interface BannerImageUploadProps {
    currentBannerUrl?: string;
    onBannerUpdate: (url: string) => void;
    className?: string;
}

export default function BannerImageUpload({
    currentBannerUrl,
    onBannerUpdate,
    className = ''
}: BannerImageUploadProps) {
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

        // Validate file size (10MB max for banners)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error('Image size must be less than 10MB');
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
            formData.append('banner', editedFile);

            const response = await apiClient.uploadBannerImage(formData);

            if (response.success) {
                onBannerUpdate(response.data.url);
                toast.success("Banner image uploaded successfully");
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to upload banner image");
        } finally {
            setUploading(false);
            setShowEditor(false);
            setSelectedFile(null);
        }
    };

    const removeBanner = () => {
        onBannerUpdate('');
        toast.success('Banner image removed');
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="space-y-2">
                <label className="text-sm font-medium">Banner Image (Optional)</label>
                <p className="text-xs text-muted-foreground">
                    Upload a banner image for your profile (recommended: 1200x300px, max 10MB)
                </p>
            </div>

            {/* Banner Preview */}
            <Card className="relative overflow-hidden">
                <Banner className="aspect-[4/1]">
                    {currentBannerUrl ? (
                        <>
                            <BannerImage
                                src={currentBannerUrl}
                                alt="Banner preview"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => document.getElementById('banner-upload-input')?.click()}
                                        disabled={uploading}
                                        className="flex items-center gap-1"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </Button>
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={removeBanner}
                                className="absolute top-2 right-2"
                                disabled={uploading}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <BannerFallback>
                            <div className="text-center">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No banner image</p>
                            </div>
                        </BannerFallback>
                    )}
                </Banner>
            </Card>

            {/* Upload Controls */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => document.getElementById('banner-upload-input')?.click()}
                    disabled={uploading}
                    className="flex-1"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : currentBannerUrl ? 'Change Banner' : 'Upload Banner'}
                </Button>

                <input
                    id="banner-upload-input"
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
                    aspectRatio={4} // 4:1 aspect ratio for banners
                    minWidth={800}
                    minHeight={200}
                    maxWidth={1200}
                    maxHeight={300}
                    isCircular={false}
                    onSave={handleSaveEditedImage}
                />
            )}
        </div>
    );
}