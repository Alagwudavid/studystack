import { supabase } from '@/lib/supabase'

export interface WaitlistStats {
    total: number
    pending: number
    confirmed: number
}

export interface AddToWaitlistParams {
    email: string
    ipAddress?: string
    userAgent?: string
}

/**
 * Add an email to the waitlist
 */
export async function addToWaitlist({ email, ipAddress, userAgent }: AddToWaitlistParams) {
    try {
        // Check if email already exists
        const { data: existingEntry } = await supabase
            .from('waitlist')
            .select('email')
            .eq('email', email.toLowerCase())
            .single()

        if (existingEntry) {
            throw new Error('Email already exists in waitlist')
        }

        // Insert new entry
        const { data, error } = await supabase
            .from('waitlist')
            .insert([
                {
                    email: email.toLowerCase(),
                    status: 'pending',
                    ip_address: ipAddress,
                    user_agent: userAgent,
                }
            ])
            .select()
            .single()

        if (error) {
            throw error
        }

        return { success: true, data }
    } catch (error: any) {
        console.error('Error adding to waitlist:', error)
        throw new Error(error.message || 'Failed to add email to waitlist')
    }
}

/**
 * Get waitlist count
 */
export async function getWaitlistCount(): Promise<number> {
    try {
        const { count, error } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })

        if (error) {
            throw error
        }

        return count || 0
    } catch (error) {
        console.error('Error getting waitlist count:', error)
        return 0
    }
}

/**
 * Get waitlist statistics
 */
export async function getWaitlistStats(): Promise<WaitlistStats> {
    try {
        const { data, error } = await supabase
            .from('waitlist')
            .select('status')

        if (error) {
            throw error
        }

        const stats = {
            total: data?.length || 0,
            pending: data?.filter(entry => entry.status === 'pending').length || 0,
            confirmed: data?.filter(entry => entry.status === 'confirmed').length || 0,
        }

        return stats
    } catch (error) {
        console.error('Error getting waitlist stats:', error)
        return { total: 0, pending: 0, confirmed: 0 }
    }
}

/**
 * Update waitlist entry status
 */
export async function updateWaitlistStatus(email: string, status: 'pending' | 'confirmed' | 'unsubscribed') {
    try {
        const { data, error } = await supabase
            .from('waitlist')
            .update({ status })
            .eq('email', email.toLowerCase())
            .select()

        if (error) {
            throw error
        }

        return { success: true, data }
    } catch (error: any) {
        console.error('Error updating waitlist status:', error)
        throw new Error(error.message || 'Failed to update waitlist status')
    }
}

/**
 * Remove email from waitlist
 */
export async function removeFromWaitlist(email: string) {
    try {
        const { error } = await supabase
            .from('waitlist')
            .delete()
            .eq('email', email.toLowerCase())

        if (error) {
            throw error
        }

        return { success: true }
    } catch (error: any) {
        console.error('Error removing from waitlist:', error)
        throw new Error(error.message || 'Failed to remove email from waitlist')
    }
}