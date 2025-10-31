"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSettingsContext } from "../TabbedSettingsLayout";
import {
    CreditCard,
    Download,
    Calendar,
    DollarSign,
    AlertCircle,
    Crown,
    Star,
    Award,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties as needed
}

interface BillingSettingsClientProps {
    serverUser?: User;
}

export default function BillingSettingsClient({
    serverUser,
}: BillingSettingsClientProps) {
    const settingsContext = useSettingsContext();
    const user = serverUser || settingsContext.user;
    const [isLoading, setIsLoading] = useState(false);

    // Mock data for demo purposes
    const currentPlan = {
        name: "Free",
        price: "$0",
        period: "month",
        features: [
            "Basic language courses",
            "5 lessons per day",
            "Community access",
            "Basic progress tracking"
        ]
    };

    const plans = [
        {
            id: "free",
            name: "Free",
            price: "$0",
            period: "month",
            description: "Perfect for getting started",
            features: [
                "Basic language courses",
                "5 lessons per day",
                "Community access",
                "Basic progress tracking"
            ],
            current: true
        },
        {
            id: "pro",
            name: "Pro",
            price: "$9.99",
            period: "month",
            description: "For serious learners",
            features: [
                "All language courses",
                "Unlimited lessons",
                "Advanced analytics",
                "Offline mode",
                "Priority support",
                "Ad-free experience"
            ],
            popular: true
        },
        {
            id: "premium",
            name: "Premium",
            price: "$19.99",
            period: "month",
            description: "The complete experience",
            features: [
                "Everything in Pro",
                "1-on-1 tutoring sessions",
                "Personalized learning path",
                "Certification programs",
                "Early access to new features"
            ]
        }
    ];

    const recentInvoices = [
        {
            id: "inv_001",
            date: "2024-01-15",
            amount: "$0.00",
            status: "paid",
            description: "Free Plan"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground">Billing</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your subscription and billing information
                </p>
            </div>

            {/* Current Plan */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        Current Plan
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">{currentPlan.name} Plan</h3>
                            <p className="text-sm text-muted-foreground">
                                {currentPlan.price}/{currentPlan.period}
                            </p>
                        </div>
                        <Badge variant="secondary">Current Plan</Badge>
                    </div>

                    <div className="space-y-2">
                        <Label>Plan Features:</Label>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {currentPlan.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                            Change Plan
                        </Button>
                        <Button variant="outline">
                            Cancel Subscription
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Available Plans */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Available Plans
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative border rounded-lg p-4 ${plan.current
                                    ? "border-primary bg-primary/5"
                                    : plan.popular
                                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                                        : "border-muted"
                                    }`}
                            >
                                {plan.popular && (
                                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
                                        Most Popular
                                    </Badge>
                                )}
                                {plan.current && (
                                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                        Current Plan
                                    </Badge>
                                )}

                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                                    <div className="text-2xl font-bold">
                                        {plan.price}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            /{plan.period}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-2 mb-4">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="text-sm flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className="w-full"
                                    variant={plan.current ? "secondary" : "default"}
                                    disabled={plan.current}
                                >
                                    {plan.current ? "Current Plan" : "Choose Plan"}
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Method
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-medium mb-2">No payment method added</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Add a payment method to upgrade to a paid plan
                        </p>
                        <Button>Add Payment Method</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Billing History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {recentInvoices.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                            <h3 className="font-medium mb-2">No billing history</h3>
                            <p className="text-sm text-muted-foreground">
                                Your billing history will appear here once you have transactions
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentInvoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{invoice.description}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(invoice.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{invoice.amount}</p>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={invoice.status === "paid" ? "sky" : "secondary"}
                                            >
                                                {invoice.status}
                                            </Badge>
                                            <Button variant="ghost" size="sm">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Billing Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="billing-name">Full Name</Label>
                            <Input
                                id="billing-name"
                                placeholder="Enter full name"
                                defaultValue={user?.name || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="billing-email">Email</Label>
                            <Input
                                id="billing-email"
                                type="email"
                                placeholder="Enter email"
                                defaultValue={user?.email || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="billing-address">Address</Label>
                            <Input
                                id="billing-address"
                                placeholder="Enter address"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="billing-city">City</Label>
                            <Input
                                id="billing-city"
                                placeholder="Enter city"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="billing-state">State/Province</Label>
                            <Input
                                id="billing-state"
                                placeholder="Enter state/province"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="billing-zip">ZIP/Postal Code</Label>
                            <Input
                                id="billing-zip"
                                placeholder="Enter ZIP/postal code"
                            />
                        </div>
                    </div>
                    <Button className="w-full">Update Billing Information</Button>
                </CardContent>
            </Card>
        </div>
    );
}