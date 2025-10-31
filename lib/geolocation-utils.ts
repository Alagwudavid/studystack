interface GeolocationPosition {
    coords: {
        latitude: number;
        longitude: number;
        accuracy: number;
        altitude?: number | null;
        altitudeAccuracy?: number | null;
        heading?: number | null;
        speed?: number | null;
    };
    timestamp: number;
}

interface LocationData {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    city?: string;
    region?: string;
    country?: string;
    address?: string;
    timezone?: string;
}

class GeolocationUtils {
    private static instance: GeolocationUtils;
    private cachedLocation: LocationData | null = null;
    private lastFetchTime: number = 0;
    private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

    static getInstance(): GeolocationUtils {
        if (!GeolocationUtils.instance) {
            GeolocationUtils.instance = new GeolocationUtils();
        }
        return GeolocationUtils.instance;
    }

    /**
     * Get user's current location using HTML5 Geolocation API
     */
    async getCurrentPosition(): Promise<LocationData> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            // Check if we have cached location
            const now = Date.now();
            if (this.cachedLocation && (now - this.lastFetchTime) < this.cacheTimeout) {
                resolve(this.cachedLocation);
                return;
            }

            const options: PositionOptions = {
                enableHighAccuracy: true,
                timeout: 10000, // 10 seconds
                maximumAge: 300000, // 5 minutes
            };

            navigator.geolocation.getCurrentPosition(
                async (position: GeolocationPosition) => {
                    try {
                        const locationData: LocationData = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                        };

                        // Try to get human-readable address
                        try {
                            const addressData = await this.reverseGeocode(
                                position.coords.latitude,
                                position.coords.longitude
                            );
                            Object.assign(locationData, addressData);
                        } catch (error) {
                            console.warn('Failed to get address from coordinates:', error);
                        }

                        this.cachedLocation = locationData;
                        this.lastFetchTime = now;
                        resolve(locationData);
                    } catch (error) {
                        reject(error);
                    }
                },
                (error: GeolocationPositionError) => {
                    let errorMessage = 'Failed to get location';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied by user';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timeout';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                options
            );
        });
    }

    /**
     * Get location using IP address (fallback method)
     */
    async getLocationByIP(): Promise<LocationData> {
        try {
            // Use a reliable IP geolocation service
            const response = await fetch('https://ipapi.co/json/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason || 'IP geolocation failed');
            }

            return {
                latitude: data.latitude,
                longitude: data.longitude,
                city: data.city,
                region: data.region,
                country: data.country_name,
                timezone: data.timezone,
            };
        } catch (error) {
            console.error('IP geolocation failed:', error);
            throw error;
        }
    }

    /**
     * Reverse geocode coordinates to human-readable address
     */
    private async reverseGeocode(lat: number, lng: number): Promise<Partial<LocationData>> {
        try {
            // Using OpenStreetMap Nominatim API (free and reliable)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'Bitroot-App/1.0 (contact@bitroot.com)', // Be respectful with user agent
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Reverse geocoding failed: ${response.status}`);
            }

            const data = await response.json();

            if (!data || data.error) {
                throw new Error('No address found for coordinates');
            }

            return {
                address: data.display_name,
                city: data.address?.city || data.address?.town || data.address?.village,
                region: data.address?.state || data.address?.region,
                country: data.address?.country,
            };
        } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            return {};
        }
    }

    /**
     * Get best available location (tries GPS first, falls back to IP)
     */
    async getBestLocation(): Promise<LocationData> {
        try {
            // Try GPS first for highest accuracy
            return await this.getCurrentPosition();
        } catch (gpsError) {
            console.warn('GPS location failed, trying IP location:', gpsError);
            try {
                // Fallback to IP-based location
                return await this.getLocationByIP();
            } catch (ipError) {
                console.error('All location methods failed:', { gpsError, ipError });
                throw new Error('Unable to determine location');
            }
        }
    }

    /**
     * Clear cached location data
     */
    clearCache(): void {
        this.cachedLocation = null;
        this.lastFetchTime = 0;
    }

    /**
     * Check if geolocation is supported
     */
    isSupported(): boolean {
        return typeof window !== 'undefined' && 'geolocation' in navigator;
    }
}

export const geolocationUtils = GeolocationUtils.getInstance();
export type { LocationData };