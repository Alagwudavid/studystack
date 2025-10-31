import { requireAuth } from '@/lib/server-auth';
import UserClient from "./UserClient";
import UserProfilePage from "./profile/page";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UnifiedUserProfilePage({ params }: Props) {
  const { username } = await params;

  let currentUser = null;
  try {
    const authResult = await requireAuth();
    currentUser = authResult.user;
  } catch {
    // User is not authenticated
  }

  const isOwnProfile = currentUser?.username === username;

  return (
    <div className='max-w-2xl mx-auto'>
      <UserProfilePage params={params} />
      {isOwnProfile && currentUser && (
        <UserClient serverUser={currentUser} username={username} />
      )}
    </div>
  );
}