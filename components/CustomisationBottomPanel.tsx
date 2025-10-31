"use client";

import { useState } from "react";
import { X, Settings, Palette, Layout, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CustomisationBottomPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CustomisationBottomPanel({ isOpen, onClose }: CustomisationBottomPanelProps) {
    const customizationOptions = [
        {
            icon: Palette,
            title: "Theme Customization",
            description: "Personalize your visual experience with custom themes and color schemes"
        },
        {
            icon: Layout,
            title: "Layout Preferences",
            description: "Adjust sidebar position, panel sizes, and overall workspace layout"
        },
        {
            icon: Zap,
            title: "Quick Actions",
            description: "Configure shortcuts and quick access buttons for your most used features"
        },
        {
            icon: Settings,
            title: "Advanced Settings",
            description: "Fine-tune performance, notifications, and advanced user preferences"
        }
    ];

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 blur-sm backdrop-blur z-30"
                    onClick={onClose}
                />
            )}

            {/* Bottom Panel */}
            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 h-[80vh] bg-muted text-foreground z-40 transition-transform duration-300 ease-in-out rounded-t-3xl pb-4 overflow-y-auto scrollbar-custom",
                    isOpen ? "transform translate-y-0" : "transform translate-y-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Customization Panel</h2>
                        <p className="text-sm text-muted-foreground">Personalize your workspace experience</p>
                    </div>
                    <Button variant="cool" size="sm" onClick={onClose}>
                        <X className="!size-6" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4 h-full overflow-y-auto max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {customizationOptions.map((option, index) => {
                            const Icon = option.icon;
                            return (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-accent cursor-pointer transition-colors group"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <h3 className="font-medium text-foreground">{option.title}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {option.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Random Text Section */}
                    <div className="mt-6 p-4 rounded-lg bg-muted/50">
                        <h3 className="font-medium text-foreground mb-2">Quick Tips</h3>
                        <p className="text-sm text-muted-foreground">
                            Customize your workspace to match your workflow. Experiment with different themes,
                            layouts, and settings to create the perfect environment for your productivity.
                            Remember that small changes can make a big difference in your daily experience!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}