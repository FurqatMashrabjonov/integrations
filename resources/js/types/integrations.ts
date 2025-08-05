import type { ReactNode } from 'react';

// Fitbit Types
export interface FitbitProfile {
    display_name: string;
    today_steps: number;
    today_distance: number;
    week_steps: number;
    last_synced_at?: string;
    avatar?: string;
}

export interface FitbitStats {
    steps?: number;
    calories?: number;
    distance?: number;
    today_steps?: number;
    today_distance?: number;
    last_synced_at?: string;
}

export interface FitbitCardProps {
    isIntegrated?: (integration: string) => boolean;
    showConnect?: boolean;
    isConnected?: boolean;
    profile?: Partial<FitbitProfile> | null;
    stats?: Partial<FitbitStats> | null;
}

export interface FitbitDrawerProps {
    isIntegrated: (integration: string) => boolean;
    autoOpen?: boolean;
    statusBadge?: ReactNode;
    profileData?: FitbitProfile | null;
}

// LeetCode Types
export interface LeetCodeProfile {
    display_name: string;
    real_name?: string;
    total_solved: number;
    easy_solved: number;
    medium_solved: number;
    hard_solved: number;
    acceptance_rate: number;
    ranking?: number;
    contributions_count?: number;
    badges_count?: number;
    last_synced_at?: string;
    avatar?: string;
}

export interface LeetCodeStats {
    problems_solved_easy: number;
    problems_solved_medium: number;
    problems_solved_hard: number;
    problems_solved_today: number;
    ranking: number;
    last_updated: string | null;
}

export interface LeetCodeCardProps {
    isIntegrated?: (integration: string) => boolean;
    showConnect?: boolean;
    dateFilter?: 'today' | 'weekly' | 'monthly';
    isConnected?: boolean;
    profile?: Partial<LeetCodeProfile> | null;
    stats?: Partial<LeetCodeStats> | null;
}

export interface LeetCodeDrawerProps {
    isIntegrated: (integration: string) => boolean;
    autoOpen?: boolean;
    statusBadge?: ReactNode;
    profileData?: LeetCodeProfile | null;
}

// Wakapi Types
export interface WakapiProfile {
    display_name: string;
    full_name?: string;
    today_hours: number;
    today_seconds: number;
    week_hours: number;
    week_seconds: number;
    languages: Array<{ name: string; total_seconds: number; percent: number }>;
    projects: Array<{ name: string; total_seconds: number; percent: number }>;
    last_synced_at?: string;
    avatar?: string;
}

export interface WakapiStats {
    coding_time: number;
    languages_count: number;
    projects_count: number;
    last_updated: string | null;
}

export interface WakapiCardProps {
    showConnect?: boolean;
    dateFilter?: 'today' | 'weekly' | 'monthly';
    isConnected?: boolean;
    profile?: Partial<WakapiProfile> | null;
    stats?: Partial<WakapiStats> | null;
}

export interface WakapiDrawerProps {
    isIntegrated: (integration: string) => boolean;
    autoOpen?: boolean;
    statusBadge?: ReactNode;
    profileData?: WakapiProfile | null;
}
