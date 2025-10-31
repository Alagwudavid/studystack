// Re-export the unified social learning posts
export { socialLearningPosts as posts } from './social-learning';
export type { SocialPost as Post } from '@/types/social-learning';

// Legacy compatibility - will be removed in the future
export { socialLearningPosts as languagePosts } from './social-learning';
export type { SocialPost as LanguagePost } from '@/types/social-learning';