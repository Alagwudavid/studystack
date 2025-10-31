'use client';

import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RotateCcw, Crop as CropIcon, Download } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorProps {
    isOpen: boolean;
    onClose: () => void;
    imageFile: File;
    aspectRatio?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    isCircular?: boolean;
    onSave: (editedFile: File) => void;
}

export default function ImageEditor({
    isOpen,
    onClose,
    imageFile,
    aspectRatio,
    minWidth = 100,
    minHeight = 100,
    maxWidth = 1200,
    maxHeight = 800,
    isCircular = false,
    onSave
}: ImageEditorProps) {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [scale, setScale] = useState([1]);
    const [rotate, setRotate] = useState([0]);
    const [imageSrc, setImageSrc] = useState<string>('');

    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        if (imageFile && isOpen) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(imageFile);
        }
    }, [imageFile, isOpen]);

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;

        // Set initial crop based on aspect ratio
        let initialCrop: Crop;
        if (aspectRatio) {
            const cropWidth = Math.min(90, (height * aspectRatio / width) * 90);
            const cropHeight = Math.min(90, (width / aspectRatio / height) * 90);
            initialCrop = {
                unit: '%',
                width: cropWidth,
                height: cropHeight,
                x: (100 - cropWidth) / 2,
                y: (100 - cropHeight) / 2
            };
        } else {
            initialCrop = {
                unit: '%',
                width: 90,
                height: 90,
                x: 5,
                y: 5
            };
        }
        setCrop(initialCrop);
    };

    const generateCroppedImage = async (): Promise<File> => {
        const image = imgRef.current;
        const canvas = canvasRef.current;

        if (!image || !canvas || !completedCrop) {
            throw new Error('Missing required elements for cropping');
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas context not available');
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Calculate output dimensions
        const outputWidth = Math.min(completedCrop.width * scaleX, maxWidth);
        const outputHeight = Math.min(completedCrop.height * scaleY, maxHeight);

        // Ensure minimum dimensions
        const finalWidth = Math.max(outputWidth, minWidth);
        const finalHeight = Math.max(outputHeight, minHeight);

        canvas.width = finalWidth;
        canvas.height = finalHeight;

        // Apply transformations
        ctx.save();
        ctx.translate(finalWidth / 2, finalHeight / 2);
        ctx.rotate((rotate[0] * Math.PI) / 180);
        ctx.scale(scale[0], scale[0]);
        ctx.translate(-finalWidth / 2, -finalHeight / 2);

        // Draw the cropped image
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            finalWidth,
            finalHeight
        );

        ctx.restore();

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], imageFile.name, {
                        type: imageFile.type,
                        lastModified: Date.now()
                    });
                    resolve(file);
                }
            }, imageFile.type, 0.9);
        });
    };

    const handleSave = async () => {
        try {
            const editedFile = await generateCroppedImage();
            onSave(editedFile);
            onClose();
        } catch (error) {
            console.error('Error processing image:', error);
        }
    };

    const resetTransforms = () => {
        setScale([1]);
        setRotate([0]);
        setCrop({
            unit: '%',
            width: 90,
            height: 90,
            x: 5,
            y: 5
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CropIcon className="w-5 h-5" />
                        Edit Image
                    </DialogTitle>
                    <DialogDescription>
                        Crop, resize, and adjust your image. Use the controls below to scale and rotate as needed.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Image Crop Area */}
                    <div className="flex justify-center">
                        {imageSrc ? (
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspectRatio}
                                minWidth={minWidth}
                                minHeight={minHeight}
                                circularCrop={isCircular}
                            >
                                <img
                                    ref={imgRef}
                                    src={imageSrc}
                                    alt="Crop preview"
                                    style={{
                                        transform: `scale(${scale[0]}) rotate(${rotate[0]}deg)`,
                                        maxWidth: '100%',
                                        maxHeight: '400px'
                                    }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        ) : (
                            <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
                                <p className="text-gray-500">Loading image...</p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Scale Control */}
                        <div className="space-y-2">
                            <Label htmlFor="scale">Scale: {scale[0].toFixed(2)}x</Label>
                            <Slider
                                id="scale"
                                min={0.5}
                                max={3}
                                step={0.1}
                                value={scale}
                                onValueChange={setScale}
                                className="w-full"
                            />
                        </div>

                        {/* Rotation Control */}
                        <div className="space-y-2">
                            <Label htmlFor="rotate">Rotation: {rotate[0]}°</Label>
                            <Slider
                                id="rotate"
                                min={-180}
                                max={180}
                                step={1}
                                value={rotate}
                                onValueChange={setRotate}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Reset Button */}
                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            onClick={resetTransforms}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!completedCrop}>
                        <Download className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </DialogFooter>

                {/* Hidden canvas for processing */}
                <canvas
                    ref={canvasRef}
                    style={{ display: 'none' }}
                />
            </DialogContent>
        </Dialog>
    );
}
