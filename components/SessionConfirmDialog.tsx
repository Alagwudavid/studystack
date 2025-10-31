import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Shield, LogOut, Users, AlertTriangle, Monitor, Globe, MapPin, Clock } from 'lucide-react';

interface SessionConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    type: 'single' | 'multiple';
    sessionInfo?: {
        deviceName?: string;
        browser?: string;
        operatingSystem?: string;
        location?: string;
        lastActivity?: string;
    };
    otherSessionsCount?: number;
}

export function SessionConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    type,
    sessionInfo,
    otherSessionsCount = 0
}: SessionConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    if (type === 'single') {
        return (
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-lg">
                            <LogOut className="h-5 w-5 text-red-600" />
                            Terminate Session
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Are you sure you want to terminate this session? The device will be logged out immediately.
                                </p>

                                {sessionInfo && (
                                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                        <div className="text-sm font-medium text-foreground">
                                            Session Details:
                                        </div>
                                        {sessionInfo.deviceName && (
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Monitor className="h-3 w-3" />
                                                <span className="font-medium">Device:</span> {sessionInfo.deviceName}
                                            </div>
                                        )}
                                        {sessionInfo.browser && sessionInfo.operatingSystem && (
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Globe className="h-3 w-3" />
                                                <span className="font-medium">Browser:</span> {sessionInfo.browser} on {sessionInfo.operatingSystem}
                                            </div>
                                        )}
                                        {sessionInfo.location && (
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <MapPin className="h-3 w-3" />
                                                <span className="font-medium">Location:</span> {sessionInfo.location}
                                            </div>
                                        )}
                                        {sessionInfo.lastActivity && (
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Clock className="h-3 w-3" />
                                                <span className="font-medium">Last Activity:</span> {sessionInfo.lastActivity}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        This action cannot be undone. The user will need to sign in again on that device.
                                    </p>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Terminate Session
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-red-600" />
                        Terminate All Other Sessions
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to terminate all other active sessions? This will log you out from all other devices and browsers.
                            </p>

                            <div className="bg-muted/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                    <Users className="h-4 w-4" />
                                    Sessions to Terminate:
                                </div>
                                <div className="text-2xl font-bold text-red-600">
                                    {otherSessionsCount}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {otherSessionsCount === 1 ? 'other session' : 'other sessions'}
                                </div>
                            </div>

                            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                        Security Action
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        This is a security measure. Use this if you suspect unauthorized access to your account or want to ensure only your current device is logged in.
                                    </p>
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground">
                                Your current session will remain active. Other devices will need to sign in again.
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        <Shield className="h-4 w-4 mr-2" />
                        Terminate {otherSessionsCount} Session{otherSessionsCount !== 1 ? 's' : ''}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

interface SessionSuccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    terminatedCount: number;
}

export function SessionSuccessDialog({
    open,
    onOpenChange,
    terminatedCount
}: SessionSuccessDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-lg text-green-600">
                        <Shield className="h-5 w-5" />
                        Sessions Terminated Successfully
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-3">
                            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold text-green-600 mb-1">
                                    {terminatedCount}
                                </div>
                                <div className="text-sm text-green-800 dark:text-green-200">
                                    {terminatedCount === 1 ? 'session' : 'sessions'} terminated
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground text-center">
                                All other devices have been logged out. Your account security has been enhanced.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={() => onOpenChange(false)}
                        className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-600"
                    >
                        Got it
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}