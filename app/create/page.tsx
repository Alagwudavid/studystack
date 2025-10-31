import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { redirect } from 'next/navigation';

export default async function CreatePage() {
  // Require authentication - will redirect to login if not authenticated
  const { user } = await requireAuth();

  // Redirect to the default post creation tab
  redirect('/create/post');
}