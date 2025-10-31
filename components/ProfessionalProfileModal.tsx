"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BriefcaseBusiness, GraduationCap, Users, BookOpen, Building, Globe, Target, X, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/user";

interface ProfessionalProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    onSuccess?: (updatedUser: User) => void;
    onApplicationSubmitted?: () => void;
}

const professionalCategories = [
    {
        group: "🎓 Education & Teaching",
        categories: [
            "Teacher / Tutor",
            "Language Instructor",
            "Academic Researcher",
            "Coach / Mentor"
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
        group: "💼 Professional & Corporate",
        categories: [
            "Business / Company",
            "Research Institute",
            "Government / Public Sector",
            "Language Center"
        ]
    }
];

export function ProfessionalProfileModal({ open, onOpenChange, user, onSuccess, onApplicationSubmitted }: ProfessionalProfileModalProps) {
    const [isApplying, setIsApplying] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [applicationId, setApplicationId] = useState<string>("");
    const [credentials, setCredentials] = useState("");
    const [switchToProfessional, setSwitchToProfessional] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const { toast } = useToast();

    const handleApply = async () => {
        if (switchToProfessional && !selectedCategory) {
            toast({
                title: "Category Required",
                description: "Please select a professional category to continue.",
                variant: "destructive",
            });
            return;
        }

        if (!credentials.trim()) {
            toast({
                title: "Credentials Required",
                description: "Please provide your credentials for professional account verification.",
                variant: "destructive",
            });
            return;
        }

        setIsApplying(true);
        setSubmissionStatus('submitting');

        try {
            const response = await apiClient.applyProfessionalProfile({
                credentials,
                switch_to_professional: switchToProfessional,
                professional_category: switchToProfessional ? selectedCategory : null,
            });

            if (response.success) {
                setSubmissionStatus('success');
                setApplicationId(response.application_id || "");

                // Show success state for 3 seconds before closing
                setTimeout(() => {
                    toast({
                        title: "Application Submitted",
                        description: `Your professional account application has been submitted for review. Application ID: ${response.application_id}`,
                    });

                    // Note: No onSuccess callback since user doesn't become professional immediately
                    // Notify parent component about application submission
                    if (onApplicationSubmitted) {
                        onApplicationSubmitted();
                    }

                    // Reset form and close modal
                    setCredentials("");
                    setSwitchToProfessional(false);
                    setSelectedCategory("");
                    setSubmissionStatus('idle');
                    setApplicationId("");
                    onOpenChange(false);
                }, 3000);
            } else {
                throw new Error(response.message || "Failed to submit application");
            }
        } catch (error: any) {
            setSubmissionStatus('error');
            toast({
                title: "Application Failed",
                description: error.message || "An error occurred while submitting your application. Please try again.",
                variant: "destructive",
            });

            // Reset status after showing error
            setTimeout(() => {
                setSubmissionStatus('idle');
            }, 3000);
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Status Overlay */}
                {submissionStatus !== 'idle' && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                        <div className="bg-background border rounded-lg p-8 shadow-lg flex flex-col items-center gap-4 min-w-[300px]">
                            {submissionStatus === 'submitting' && (
                                <>
                                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                    <div className="text-center">
                                        <h3 className="text-lg font-medium">Submitting Request...</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Processing your professional profile application
                                        </p>
                                    </div>
                                </>
                            )}

                            {submissionStatus === 'success' && (
                                <>
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                    <div className="text-center">
                                        <h3 className="text-lg font-medium text-green-700">Application Submitted!</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Your application is being reviewed
                                        </p>
                                        {applicationId && (
                                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                                <p className="text-sm font-medium text-green-800">Application ID</p>
                                                <p className="text-lg font-mono font-bold text-green-900">{applicationId}</p>
                                                <p className="text-xs text-green-600 mt-1">Save this ID for reference</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {submissionStatus === 'error' && (
                                <>
                                    <X className="w-12 h-12 text-red-500" />
                                    <div className="text-center">
                                        <h3 className="text-lg font-medium text-red-700">Submission Failed</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Please try again or contact support
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BriefcaseBusiness className="w-5 h-5" />
                        Apply for Professional Profile
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Credentials Section */}
                    <div className="space-y-3">
                        <Label htmlFor="credentials" className="text-foreground font-medium">
                            Professional Credentials
                        </Label>
                        <Textarea
                            id="credentials"
                            placeholder="Please provide details about your professional background, qualifications, experience, and why you should be granted a professional account. Include relevant certifications, degrees, work experience, or other credentials that support your application."
                            value={credentials}
                            onChange={(e) => setCredentials(e.target.value)}
                            rows={6}
                            className="resize-none"
                        />
                        <p className="text-sm text-muted-foreground">
                            This information will be reviewed by our team to verify your professional status.
                        </p>
                    </div>

                    {/* Switch Toggle Section */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="switch-professional" className="text-foreground font-medium">
                                    Switch to Professional Account
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Enable this to immediately activate your professional profile upon approval.
                                </p>
                            </div>
                            <Switch
                                id="switch-professional"
                                checked={switchToProfessional}
                                onCheckedChange={setSwitchToProfessional}
                            />
                        </div>

                        {/* Category Selection - Only shown when switch is enabled */}
                        {switchToProfessional && (
                            <div className="space-y-3 ml-4 border-l-2 border-primary/20 pl-4">
                                <Label htmlFor="category" className="text-foreground font-medium">
                                    Professional Category
                                </Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                                <p className="text-sm text-muted-foreground">
                                    Choose the category that best describes your professional role.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Benefits Section */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Professional Account Benefits
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                Verified professional badge on your profile
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                Access to professional networking features
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                Enhanced profile visibility in your category
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                Priority support and advanced analytics
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isApplying || submissionStatus !== 'idle'}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApply}
                            disabled={isApplying || !credentials.trim() || submissionStatus !== 'idle'}
                            className="flex-1"
                        >
                            {isApplying ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}