// app/signup/page.tsx
'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const r = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    instagram: '',
    address: '',
    email: '',
    password: '',
  });
  const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: `${form.firstName} ${form.lastName}`.trim() });

      const addressPayload = place ? {
        formatted_address: place.formatted_address || form.address,
        place_id: place.place_id || null,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
        address_components: place.address_components || [],
      } : { formatted_address: form.address };

      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        instagram: form.instagram,
        address: addressPayload,
        email: form.email,
        createdAt: serverTimestamp(),
      });

      r.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-xl border px-3 py-2" placeholder="First name" value={form.firstName} onChange={(e)=>onChange('firstName', (e.target as HTMLInputElement).value)} required />
          <input className="rounded-xl border px-3 py-2" placeholder="Last name" value={form.lastName} onChange={(e)=>onChange('lastName', (e.target as HTMLInputElement).value)} required />
        </div>
        <input className="rounded-xl border px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e)=>onChange('phone', (e.target as HTMLInputElement).value)} />
        <input className="rounded-xl border px-3 py-2" placeholder="Instagram" value={form.instagram} onChange={(e)=>onChange('instagram', (e.target as HTMLInputElement).value)} />
        <AddressAutocomplete
          id="address"
          value={form.address}
          onChange={(v)=>onChange('address', v)}
          onPlaceSelected={(p)=>setPlace(p)}
          placeholder="Address"
        />
        <input type="email" className="rounded-xl border px-3 py-2" placeholder="Email" value={form.email} onChange={(e)=>onChange('email', (e.target as HTMLInputElement).value)} required />
        <input type="password" className="rounded-xl border px-3 py-2" placeholder="Password" value={form.password} onChange={(e)=>onChange('password', (e.target as HTMLInputElement).value)} required />

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
