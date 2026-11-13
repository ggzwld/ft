import type { ReactNode } from 'react';
import { Clock3, Construction } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEVELOPMENT_EMAILS = new Set(['ox@gmail.com', 'empowise2@gmail.com']);

function hasDevelopmentAccess(email?: string | null) {
  return Boolean(email && DEVELOPMENT_EMAILS.has(email.trim().toLowerCase()));
}

function UnderDevelopmentState() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" aria-labelledby="under-development-title">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-slate-900/70 p-8 text-center shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-12">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 text-white shadow-lg shadow-purple-900/40">
          <Construction className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-300/20 bg-purple-400/10 px-3 py-1 text-sm font-medium text-purple-100">
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          Work in progress...
        </p>
        <h1 id="under-development-title" className="font-playfair text-3xl font-bold text-white sm:text-4xl">
          Coming soon
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-300">
          Stay tuned
        </p>
      </div>
    </section>
  );
}

export default function DevelopmentGate({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const email = session?.user?.email ?? user?.email;

  if (hasDevelopmentAccess(email)) {
    return <>{children}</>;
  }

  return <UnderDevelopmentState />;
}
