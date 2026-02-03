'use client';

import { cn } from '@/lib/utils';
import { useRoomStore } from '@/store/roomStore';
import { RoomType, ROOM_TYPES } from '@/types';
import { Bed, Sofa, Monitor, Home, UtensilsCrossed, ChefHat } from 'lucide-react';

const roomIcons: Record<RoomType, React.ElementType> = {
  bedroom: Bed,
  living_room: Sofa,
  office: Monitor,
  den: Home,
  dining_room: UtensilsCrossed,
  kitchen: ChefHat,
};

export default function RoomTypeSelector() {
  const { roomConfig, setRoomType } = useRoomStore();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Select Room Type
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {ROOM_TYPES.map((room) => {
          const Icon = roomIcons[room.value];
          const isSelected = roomConfig.type === room.value;

          return (
            <button
              key={room.value}
              onClick={() => setRoomType(room.value)}
              className={cn(
                'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <Icon className={cn('h-8 w-8 mb-2', isSelected ? 'text-primary-600' : 'text-slate-400')} />
              <span className="text-sm font-medium">{room.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
