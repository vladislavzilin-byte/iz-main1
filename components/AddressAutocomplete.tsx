// components/AddressAutocomplete.tsx
'use client';
import { useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  id?: string;
};

export default function AddressAutocomplete({ value, onChange, onPlaceSelected, placeholder, id }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    const existing = document.getElementById('google-maps');
    if (!existing) {
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      s.async = true;
      s.id = 'google-maps';
      document.body.appendChild(s);
      s.onload = () => initAutocomplete();
    } else {
      if ((window as any).google) initAutocomplete();
      else existing.addEventListener('load', initAutocomplete, { once: true } as any);
    }

    function initAutocomplete() {
      if (!inputRef.current || !(window as any).google) return;
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current as HTMLInputElement, {
        fields: ['formatted_address', 'geometry', 'place_id', 'address_components'],
        types: ['address'],
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        onChange(place.formatted_address || '');
        onPlaceSelected?.(place);
      });
    }
  }, [onChange, onPlaceSelected]);

  return (
    <input
      id={id}
      ref={inputRef}
      value={value}
      onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      placeholder={placeholder || 'Address'}
      className="w-full rounded-xl border px-3 py-2"
      autoComplete="off"
    />
  );
}
