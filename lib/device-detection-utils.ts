interface DeviceInfo {
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    browserVersion: string;
    operatingSystem: string;
    osVersion: string;
    deviceName: string;
    userAgent: string;
    platform: string;
    screenResolution?: string;
    touchSupport: boolean;
    language: string;
    timezone: string;
}

class DeviceDetectionUtils {
    private static instance: DeviceDetectionUtils;

    static getInstance(): DeviceDetectionUtils {
        if (!DeviceDetectionUtils.instance) {
            DeviceDetectionUtils.instance = new DeviceDetectionUtils();
        }
        return DeviceDetectionUtils.instance;
    }

    /**
     * Comprehensive device detection
     */
    getDeviceInfo(): DeviceInfo {
        if (typeof window === 'undefined') {
            return this.getServerSideDeviceInfo();
        }

        const userAgent = navigator.userAgent;
        const platform = navigator.platform;

        return {
            deviceType: this.detectDeviceType(userAgent),
            browser: this.detectBrowser(userAgent).name,
            browserVersion: this.detectBrowser(userAgent).version,
            operatingSystem: this.detectOperatingSystem(userAgent, platform).name,
            osVersion: this.detectOperatingSystem(userAgent, platform).version,
            deviceName: this.generateDeviceName(userAgent, platform),
            userAgent: userAgent,
            platform: platform,
            screenResolution: this.getScreenResolution(),
            touchSupport: this.detectTouchSupport(),
            language: navigator.language || 'en-US',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
    }

    /**
     * Detect device type with better accuracy
     */
    private detectDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
        const ua = userAgent.toLowerCase();

        // Tablet detection (more specific patterns)
        if (
            /ipad/.test(ua) ||
            (/android/.test(ua) && !/mobile/.test(ua)) ||
            /tablet/.test(ua) ||
            /kindle/.test(ua) ||
            (/windows/.test(ua) && /touch/.test(ua) && !/phone/.test(ua))
        ) {
            return 'tablet';
        }

        // Mobile detection (comprehensive patterns)
        if (
            /mobile/.test(ua) ||
            /iphone/.test(ua) ||
            /ipod/.test(ua) ||
            /android.*mobile/.test(ua) ||
            /blackberry/.test(ua) ||
            /windows phone/.test(ua) ||
            /nokia/.test(ua) ||
            /opera mini/.test(ua) ||
            /samsung/.test(ua) ||
            /huawei/.test(ua) ||
            /xiaomi/.test(ua)
        ) {
            return 'mobile';
        }

        return 'desktop';
    }

    /**
     * Enhanced browser detection
     */
    private detectBrowser(userAgent: string): { name: string; version: string } {
        const ua = userAgent.toLowerCase();

        // Browser patterns with version extraction
        const browsers = [
            { name: 'Edge', pattern: /edg(?:e|ios|a)?\/([\d\.]+)/ },
            { name: 'Chrome', pattern: /chrome\/([\d\.]+)/ },
            { name: 'Firefox', pattern: /firefox\/([\d\.]+)/ },
            { name: 'Safari', pattern: /version\/([\d\.]+).*safari/ },
            { name: 'Opera', pattern: /(?:opera|opr)\/([\d\.]+)/ },
            { name: 'Samsung Internet', pattern: /samsungbrowser\/([\d\.]+)/ },
            { name: 'Internet Explorer', pattern: /(?:msie |trident.*rv:)([\d\.]+)/ },
        ];

        for (const browser of browsers) {
            const match = ua.match(browser.pattern);
            if (match) {
                return {
                    name: browser.name,
                    version: match[1] || 'Unknown',
                };
            }
        }

        return { name: 'Unknown', version: 'Unknown' };
    }

    /**
     * Enhanced operating system detection
     */
    private detectOperatingSystem(userAgent: string, platform: string): { name: string; version: string } {
        const ua = userAgent.toLowerCase();

        // OS patterns with version extraction
        const systems = [
            {
                name: 'iOS',
                pattern: /os ([\d_]+)/,
                formatter: (version: string) => version.replace(/_/g, '.'),
            },
            {
                name: 'Android',
                pattern: /android ([\d\.]+)/,
                formatter: (version: string) => version,
            },
            {
                name: 'Windows',
                pattern: /windows nt ([\d\.]+)/,
                formatter: (version: string) => {
                    const versions: Record<string, string> = {
                        '10.0': '10/11',
                        '6.3': '8.1',
                        '6.2': '8',
                        '6.1': '7',
                        '6.0': 'Vista',
                        '5.1': 'XP',
                    };
                    return versions[version] || version;
                },
            },
            {
                name: 'macOS',
                pattern: /mac os x ([\d_]+)/,
                formatter: (version: string) => version.replace(/_/g, '.'),
            },
            {
                name: 'Linux',
                pattern: /linux/,
                formatter: () => 'Unknown',
            },
        ];

        for (const system of systems) {
            if (system.pattern.test(ua)) {
                const match = ua.match(system.pattern);
                const version = match && match[1] ? system.formatter(match[1]) : 'Unknown';
                return {
                    name: system.name,
                    version: version,
                };
            }
        }

        return { name: 'Unknown', version: 'Unknown' };
    }

    /**
     * Generate a friendly device name
     */
    private generateDeviceName(userAgent: string, platform: string): string {
        const ua = userAgent.toLowerCase();
        const browser = this.detectBrowser(userAgent);
        const os = this.detectOperatingSystem(userAgent, platform);
        const deviceType = this.detectDeviceType(userAgent);

        // Specific device models
        if (/iphone/.test(ua)) {
            const model = this.extractIOSDevice(ua);
            return model ? `${model}` : 'iPhone';
        }

        if (/ipad/.test(ua)) {
            return 'iPad';
        }

        if (/android/.test(ua)) {
            const model = this.extractAndroidDevice(ua);
            return model || 'Android Device';
        }

        // Generic naming based on OS and device type
        const deviceTypeCapitalized = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);

        if (os.name === 'Windows') {
            return `Windows ${deviceTypeCapitalized}`;
        }

        if (os.name === 'macOS') {
            return deviceType === 'desktop' ? 'Mac' : `Mac ${deviceTypeCapitalized}`;
        }

        if (os.name === 'Linux') {
            return `Linux ${deviceTypeCapitalized}`;
        }

        return `${os.name} ${deviceTypeCapitalized}`;
    }

    /**
     * Extract iOS device model
     */
    private extractIOSDevice(userAgent: string): string | null {
        const patterns = [
            { pattern: /iphone os 1[5-9]|iphone os [2-9]\d/, model: 'iPhone' },
            { pattern: /ipad/, model: 'iPad' },
            { pattern: /ipod/, model: 'iPod' },
        ];

        for (const { pattern, model } of patterns) {
            if (pattern.test(userAgent)) {
                return model;
            }
        }

        return null;
    }

    /**
     * Extract Android device model
     */
    private extractAndroidDevice(userAgent: string): string | null {
        const ua = userAgent.toLowerCase();

        // Common Android device patterns
        const patterns = [
            { pattern: /samsung/i, extract: /samsung ([^;]+)/ },
            { pattern: /huawei/i, extract: /huawei ([^;]+)/ },
            { pattern: /xiaomi/i, extract: /xiaomi ([^;]+)/ },
            { pattern: /oneplus/i, extract: /oneplus ([^;]+)/ },
            { pattern: /pixel/i, extract: /(pixel [^;]+)/ },
            { pattern: /lg-/i, extract: /(lg-[^;]+)/ },
            { pattern: /sony/i, extract: /sony ([^;]+)/ },
        ];

        for (const { pattern, extract } of patterns) {
            if (pattern.test(userAgent)) {
                const match = userAgent.match(extract);
                if (match && match[1]) {
                    return match[1].trim();
                }
            }
        }

        return null;
    }

    /**
     * Get screen resolution
     */
    private getScreenResolution(): string {
        if (typeof window === 'undefined') return 'Unknown';

        return `${window.screen.width}x${window.screen.height}`;
    }

    /**
     * Detect touch support
     */
    private detectTouchSupport(): boolean {
        if (typeof window === 'undefined') return false;

        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            // @ts-ignore - for older browsers
            navigator.msMaxTouchPoints > 0
        );
    }

    /**
     * Server-side fallback (minimal info)
     */
    private getServerSideDeviceInfo(): DeviceInfo {
        return {
            deviceType: 'desktop',
            browser: 'Unknown',
            browserVersion: 'Unknown',
            operatingSystem: 'Unknown',
            osVersion: 'Unknown',
            deviceName: 'Server',
            userAgent: 'Unknown',
            platform: 'Unknown',
            touchSupport: false,
            language: 'en-US',
            timezone: 'UTC',
        };
    }

    /**
     * Get a user-friendly device description
     */
    getDeviceDescription(deviceInfo?: DeviceInfo): string {
        const info = deviceInfo || this.getDeviceInfo();

        const parts = [info.deviceName];

        if (info.browser !== 'Unknown') {
            parts.push(`${info.browser}`);
            if (info.browserVersion !== 'Unknown') {
                parts.push(`${info.browserVersion}`);
            }
        }

        return parts.join(' • ');
    }

    /**
     * Check if device is mobile
     */
    isMobile(): boolean {
        return this.getDeviceInfo().deviceType === 'mobile';
    }

    /**
     * Check if device is tablet
     */
    isTablet(): boolean {
        return this.getDeviceInfo().deviceType === 'tablet';
    }

    /**
     * Check if device is desktop
     */
    isDesktop(): boolean {
        return this.getDeviceInfo().deviceType === 'desktop';
    }
}

export const deviceDetectionUtils = DeviceDetectionUtils.getInstance();
export type { DeviceInfo };