import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import CommunityClient from "./CommunityClient";

export default function CommunityPage() {
  return (
    <ProtectedLayout user={null}>
      <CommunityClient />
    </ProtectedLayout>
  );
}
