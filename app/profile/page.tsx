// app/profile/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import AddressAutocomplete from '@/components/AddressAutocomplete';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const r = useRouter();
  const [form, setForm] = useState<any>(null);
  const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      r.replace('/login');
      return;
    }
    (async () => {
      const snap = await getDoc(doc(db, 'users', user.uid));
      const data = snap.data() || {};
      setForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        instagram: data.instagram || '',
        address: data.address?.formatted_address || '',
        email: user.email || '',
      });
    })();
  }, [user, loading, r]);

  if (!form) return null;

  const onChange = (k: string, v: string) => setForm((s: any) => ({ ...s, [k]: v }));

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      const addressPayload = place ? {
        formatted_address: place.formatted_address || form.address,
        place_id: place.place_id || null,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
        address_components: place.address_components || [],
      } : { formatted_address: form.address };

      await updateDoc(doc(db, 'users', user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        instagram: form.instagram,
        address: addressPayload,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-xl border px-3 py-2" placeholder="First name" value={form.firstName} onChange={(e)=>onChange('firstName', (e.target as HTMLInputElement).value)} />
          <input className="rounded-xl border px-3 py-2" placeholder="Last name" value={form.lastName} onChange={(e)=>onChange('lastName', (e.target as HTMLInputElement).value)} />
        </div>
        <input className="rounded-xl border px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e)=>onChange('phone', (e.target as HTMLInputElement).value)} />
        <input className="rounded-xl border px-3 py-2" placeholder="Instagram" value={form.instagram} onChange={(e)=>onChange('instagram', (e.target as HTMLInputElement).value)} />
        <AddressAutocomplete
          value={form.address}
          onChange={(v)=>onChange('address', v)}
          onPlaceSelected={(p)=>setPlace(p)}
          placeholder="Address"
        />
        <button onClick={save} disabled={saving} className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50 w-max">{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
}
