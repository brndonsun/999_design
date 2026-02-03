'use client';

import { useRoomStore } from '@/store/roomStore';
import { Country } from '@/types';
import { cn } from '@/lib/utils';

export default function CountryToggle() {
  const { roomConfig, setCountry } = useRoomStore();

  const countries: { value: Country; label: string; flag: string }[] = [
    { value: 'US', label: 'United States', flag: '🇺🇸' },
    { value: 'CA', label: 'Canada', flag: '🇨🇦' },
  ];

  return (
    <div className="flex items-center gap-2">
      {countries.map((country) => {
        const isSelected = roomConfig.country === country.value;

        return (
          <button
            key={country.value}
            onClick={() => setCountry(country.value)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              isSelected
                ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-500'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            <span>{country.flag}</span>
            <span>{country.value}</span>
          </button>
        );
      })}
    </div>
  );
}
