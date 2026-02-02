import AccessCodeForm from '@/components/AccessCodeForm';
import Builder from '@/components/Builder';
import { readAccessCookie, verifyAccessToken } from '@/lib/auth';

export default function HomePage() {
  const token = readAccessCookie();
  const authorized = verifyAccessToken(token);

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <AccessCodeForm />
      </main>
    );
  }

  return <Builder />;
}
