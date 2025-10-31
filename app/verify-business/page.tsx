"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Shield,
    Target,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Loader2,
    Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

// Professional categories from onboarding
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

interface BusinessVerificationData {
    professional_category?: string;
    credentials?: string;
    organization?: string;
    website?: string;
    additional_info?: string;
}

export default function VerifyBusinessPage() {
    const router = useRouter();
    const { user, refreshProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [verificationData, setVerificationData] = useState<BusinessVerificationData>({});

    const handleSubmit = async () => {
        // Validate required fields
        if (!verificationData.professional_category) {
            toast.error("Please select a professional category");
            return;
        }

        if (!verificationData.credentials?.trim()) {
            toast.error("Please provide your professional credentials");
            return;
        }

        setIsLoading(true);

        try {
            console.log('Submitting business verification application...');
            console.log('Verification data:', verificationData);

            // Apply for professional profile
            const professionalResponse = await apiClient.applyProfessionalProfile({
                credentials: verificationData.credentials.trim(),
                switch_to_professional: true,
                professional_category: verificationData.professional_category,
            });

            if (professionalResponse.success) {
                // If we have additional business info, save it to onboarding data
                const businessData: any = {};
                if (verificationData.organization?.trim()) {
                    businessData.organization = verificationData.organization.trim();
                }
                if (verificationData.website?.trim()) {
                    businessData.website = verificationData.website.trim();
                }
                if (verificationData.additional_info?.trim()) {
                    businessData.additional_info = verificationData.additional_info.trim();
                }

                // Update onboarding data with business info if provided
                if (Object.keys(businessData).length > 0) {
                    try {
                        await apiClient.updateOnboarding(businessData);
                    } catch (error) {
                        console.warn('Failed to save additional business info:', error);
                    }
                }

                toast.success(`Professional verification application submitted! Application ID: ${professionalResponse.application_id}`);

                // Refresh profile data
                await refreshProfile();

                // Redirect to dashboard or profile
                router.push('/dashboard');
            } else {
                throw new Error(professionalResponse.message || 'Failed to submit verification application');
            }

        } catch (error: any) {
            console.error('Business verification error:', error);
            toast.error(error.message || "Failed to submit verification application");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold">Business Verification</h1>
                    <p className="text-muted-foreground text-lg">
                        Get verified to unlock advanced business features and build trust with your audience
                    </p>
                </div>

                {/* Benefits Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Professional Verification Benefits
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Verified Professional Badge</p>
                                    <p className="text-sm text-muted-foreground">Stand out with a verified checkmark on your profile</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Advanced Analytics</p>
                                    <p className="text-sm text-muted-foreground">Access detailed insights about your audience and content performance</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Priority in Search Results</p>
                                    <p className="text-sm text-muted-foreground">Higher visibility for verified professionals</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Course Creation Tools</p>
                                    <p className="text-sm text-muted-foreground">Create and manage professional courses and content</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Verification Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Verification Application</CardTitle>
                        <CardDescription>
                            Please provide your professional information for verification review
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Professional Category */}
                        <div className="space-y-3">
                            <Label htmlFor="category" className="text-foreground font-medium">
                                Professional Category *
                            </Label>
                            <Select
                                value={verificationData.professional_category}
                                onValueChange={(value) => setVerificationData(prev => ({ ...prev, professional_category: value }))}
                            >
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

                        {/* Professional Credentials */}
                        <div className="space-y-3">
                            <Label htmlFor="credentials" className="text-foreground font-medium">
                                Professional Credentials *
                            </Label>
                            <Textarea
                                id="credentials"
                                placeholder="Please provide detailed information about your professional background, qualifications, experience, and credentials. Include relevant certifications, degrees, work experience, or other qualifications that support your professional status."
                                value={verificationData.credentials || ''}
                                onChange={(e) => setVerificationData(prev => ({ ...prev, credentials: e.target.value }))}
                                rows={6}
                                className="resize-none"
                            />
                            <p className="text-sm text-muted-foreground">
                                Be as detailed as possible. Include education, certifications, work experience, and any relevant qualifications.
                            </p>
                        </div>

                        {/* Organization */}
                        <div className="space-y-3">
                            <Label htmlFor="organization">Organization (Optional)</Label>
                            <Input
                                id="organization"
                                placeholder="Company, school, institution, or organization"
                                value={verificationData.organization || ''}
                                onChange={(e) => setVerificationData(prev => ({ ...prev, organization: e.target.value }))}
                            />
                            <p className="text-sm text-muted-foreground">
                                Current or primary organization you're affiliated with.
                            </p>
                        </div>

                        {/* Website */}
                        <div className="space-y-3">
                            <Label htmlFor="website">Professional Website (Optional)</Label>
                            <Input
                                id="website"
                                placeholder="https://yourwebsite.com"
                                value={verificationData.website || ''}
                                onChange={(e) => setVerificationData(prev => ({ ...prev, website: e.target.value }))}
                            />
                            <p className="text-sm text-muted-foreground">
                                Personal website, portfolio, or professional profile link.
                            </p>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-3">
                            <Label htmlFor="additional_info">Additional Information (Optional)</Label>
                            <Textarea
                                id="additional_info"
                                placeholder="Any additional information that would help verify your professional status..."
                                value={verificationData.additional_info || ''}
                                onChange={(e) => setVerificationData(prev => ({ ...prev, additional_info: e.target.value }))}
                                rows={3}
                                className="resize-none"
                            />
                            <p className="text-sm text-muted-foreground">
                                Any additional details that would help with the verification process.
                            </p>
                        </div>

                        {/* Review Information */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-blue-900 dark:text-blue-100">
                                        Review Process
                                    </p>
                                    <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                                        Your application will be reviewed by our team within 3-5 business days. You'll receive an email notification with the verification status.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between pt-6">
                            <Button
                                variant="outline"
                                onClick={handleGoBack}
                                disabled={isLoading}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Button>

                            <Button
                                onClick={handleSubmit}
                                disabled={
                                    isLoading ||
                                    !verificationData.professional_category ||
                                    !verificationData.credentials?.trim()
                                }
                                className="min-w-[140px]"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Submit Application
                                        <Shield className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Section */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <Building2 className="w-8 h-8 text-muted-foreground mx-auto" />
                            <p className="text-sm text-muted-foreground">
                                All information provided will be kept confidential and used solely for verification purposes.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}