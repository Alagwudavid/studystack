'use client';

import { BottomWidget } from "../BottomWidget";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Grid layout for desktop, single column for mobile */}
            <div className="grid lg:grid-cols-2 min-h-screen">
                {/* Left side - Auth form */}
                <div className="flex items-center justify-center p-4 lg:p-8">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>

                {/* Right side - Decorative image (hidden on mobile) */}
                <div className="hidden lg:block relative overflow-hidden bg-background h-screen p-6">
                    <div className="w-full h-full rounded-3xl bg-slate-700 overflow-hidden relative shadow-lg">
                        <img src="/assets/auth_bg.jpg" className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-card/30 backdrop-blur-sm"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-white/90 dark:bg-gray-800/90 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <svg viewBox="0 0 1.39 1.37" className="size-12 text-primary" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d="M0.76 0.47c-0.04,-0.03 -0.07,-0.07 -0.16,-0.13 -0.16,-0.07 -0.27,-0.08 -0.42,0.03 -0.04,0.03 -0.08,0.07 -0.11,0.11 -0.14,0.22 -0.01,0.46 -0.01,0.64 0,0.05 0.01,0.09 -0.02,0.14 -0.02,0.04 -0.04,0.04 -0.04,0.08 0,0.01 0.02,0.03 0.04,0.03 0.03,0 0.04,-0.07 0.17,-0.07 0.09,0 0.17,0.02 0.24,0.03 0.2,0.03 0.34,0.04 0.49,-0.08 0.2,-0.2 0.18,-0.4 0,-0.6 -0.01,-0.01 -0.03,-0.03 -0.03,-0.04 0.01,0 0.05,-0.01 0.07,-0.01 0.1,-0.02 0.15,-0.04 0.25,-0.08 0.02,-0.01 0.09,-0.04 0.09,-0.07 0,-0.02 -0.01,-0.04 -0.03,-0.04 -0.01,0 -0.07,0.04 -0.1,0.05 -0.1,0.05 -0.15,0.06 -0.26,0.08l-0.07 0.01 0.06 -0.06c0.06,-0.06 0.12,-0.11 0.19,-0.16 0.07,-0.04 0.12,-0.07 0.2,-0.09 0.04,-0.01 0.08,-0.01 0.08,-0.05 0,-0.06 -0.09,-0.02 -0.12,-0.01 -0.03,0.01 -0.05,0.02 -0.08,0.03 -0.03,0.02 -0.05,0.03 -0.08,0.04 -0.08,0.05 -0.11,0.07 -0.18,0.14l-0.1 0.09c0,-0.05 0.05,-0.18 0.06,-0.22 0.03,-0.06 0.05,-0.12 0.08,-0.17 0.01,-0.01 0.03,-0.04 0.03,-0.05 0,-0.02 -0.01,-0.04 -0.03,-0.04 -0.03,0 -0.04,0.03 -0.05,0.04 -0.01,0.02 -0.02,0.04 -0.03,0.06 -0.02,0.04 -0.04,0.08 -0.05,0.13 -0.03,0.06 -0.04,0.09 -0.06,0.16 0,0.02 -0.01,0.07 -0.02,0.08z" />
                                    </g>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-card-foreground mb-2">Learn at Your Pace</h2>
                            <p className="text-card-foreground max-w-xs">
                                Unlock your potential and network with peers right on the Bitroot App!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
