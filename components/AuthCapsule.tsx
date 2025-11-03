// components/AuthCapsule.tsx
'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AuthCapsule() {
  const { user, loading } = useAuth();

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      {!loading && !user && (
        <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-2 shadow-md border">
          <Link href="/login" className="rounded-full px-3 py-1 text-sm font-medium border hover:bg-gray-50">LOGIN</Link>
          <Link href="/signup" className="rounded-full px-3 py-1 text-sm font-medium bg-black text-white hover:opacity-90">SIGN UP</Link>
        </div>
      )}

      {!loading && user && (
        <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-2 shadow-md border">
          <Link href="/profile" className="rounded-full px-3 py-1 text-sm font-medium border hover:bg-gray-50">PROFILE</Link>
          <button
            onClick={() => signOut(auth)}
            className="rounded-full px-3 py-1 text-sm font-medium bg-black text-white hover:opacity-90"
          >
            LOGOUT
          </button>
        </div>
      )}
    </div>
  );
}
