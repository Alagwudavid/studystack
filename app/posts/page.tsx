import { redirect } from 'next/navigation';

export default function PostsPage() {
  // Redirect to home page since individual posts are accessed via /posts/[slug]
  redirect('/home');
}