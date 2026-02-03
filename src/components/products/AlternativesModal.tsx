'use client';

import { useState, useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import ProductCard from './ProductCard';
import { useRoomStore } from '@/store/roomStore';
import { getAlternatives } from '@/data/sampleProducts';
import { Product } from '@/types';
import Button from '@/components/ui/Button';
import { ArrowLeftRight } from 'lucide-react';

interface AlternativesModalProps {
  isOpen: boolean;
  onClose: () => void;
  furnitureId: string | null;
}

export default function AlternativesModal({
  isOpen,
  onClose,
  furnitureId,
}: AlternativesModalProps) {
  const { furniture, roomConfig, swapFurniture } = useRoomStore();
  const [selectedAlternative, setSelectedAlternative] = useState<Product | null>(null);

  const currentItem = furnitureId
    ? furniture.find((f) => f.id === furnitureId)
    : null;

  const alternatives = useMemo(() => {
    if (!currentItem) return [];
    return getAlternatives(currentItem.product, roomConfig.budget);
  }, [currentItem, roomConfig.budget]);

  const handleSwap = () => {
    if (furnitureId && selectedAlternative) {
      swapFurniture(furnitureId, selectedAlternative);
      onClose();
      setSelectedAlternative(null);
    }
  };

  if (!currentItem) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Find Alternatives"
      size="xl"
    >
      <div className="space-y-6">
        {/* Current item */}
        <div>
          <h4 className="text-sm font-medium text-slate-500 mb-2">Current Selection</h4>
          <ProductCard product={currentItem.product} isSelected />
        </div>

        {/* Alternatives */}
        <div>
          <h4 className="text-sm font-medium text-slate-500 mb-2">
            Alternatives ({alternatives.length})
          </h4>

          {alternatives.length === 0 ? (
            <p className="text-center py-8 text-slate-400">
              No alternatives found in your budget range
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
              {alternatives.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedAlternative?.id === product.id}
                  onSelect={() => setSelectedAlternative(product)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSwap}
            disabled={!selectedAlternative}
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Swap Item
          </Button>
        </div>
      </div>
    </Modal>
  );
}
