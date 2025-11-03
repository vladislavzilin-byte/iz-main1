// app/login/page.tsx
'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      r.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input type="email" className="rounded-xl border px-3 py-2" placeholder="Email" value={email} onChange={(e)=>setEmail((e.target as HTMLInputElement).value)} required />
        <input type="password" className="rounded-xl border px-3 py-2" placeholder="Password" value={password} onChange={(e)=>setPassword((e.target as HTMLInputElement).value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50">
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
