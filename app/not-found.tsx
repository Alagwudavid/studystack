import Link from 'next/link';
import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { OnboardingGuard } from '@/components/OnboardingGuard';

export default async function NotFound() {
  const { user } = await requireAuth();
  return (
  <ProtectedLayout user={user}>
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        {/* 404 Icon */}
        <div className="mb-4">
          <div className="w-fit text-muted-foreground mb-2 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className='size-14' viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="m2 2l20 20m-2.152-7.063c.152-.368.152-.776.152-1.594V10c0-3.771 0-5.657-1.172-6.828S15.771 2 12 2c-2.667 0-4.39 0-5.586.414m-2 2C4 5.61 4 7.334 4 10v4.544c0 3.245 0 4.868.886 5.967a4 4 0 0 0 .603.603C6.59 22 8.211 22 11.456 22c.705 0 1.058 0 1.381-.114q.1-.036.197-.082c.31-.148.559-.397 1.058-.896L17.5 17.5"></path><path d="M13 21.5v-.751c0-2.829 0-4.243.879-5.122c.3-.3.662-.497 1.121-.627"></path></g></svg>
          </div>
          <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-muted-foreground mb-4">Content not found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the content you're looking for.
          Content might not exist or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/home"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Go to Home
          </Link>
          <Link
            href="/explore"
            className="border px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Go back
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Looking for something specific?</p>
          <p className="mt-1">
            Try searching for it or check if the content is spelled correctly.
          </p>
        </div>
      </div>
    </main>
  </ProtectedLayout>
  );
}