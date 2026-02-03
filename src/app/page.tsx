'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import RoomTypeSelector from '@/components/design/RoomTypeSelector';
import StyleSelector from '@/components/design/StyleSelector';
import BudgetSelector from '@/components/design/BudgetSelector';
import DimensionInput from '@/components/design/DimensionInput';
import ProductList from '@/components/products/ProductList';
import AlternativesModal from '@/components/products/AlternativesModal';
import PriceSummary from '@/components/products/PriceSummary';
import Button from '@/components/ui/Button';
import { useRoomStore } from '@/store/roomStore';
import { getRecommendedProducts } from '@/data/sampleProducts';
import { generateId, inchesToPixels } from '@/lib/utils';
import { FurnitureItem } from '@/types';
import { Wand2, ArrowRight, Loader2 } from 'lucide-react';

// Dynamic import for Konva (client-side only)
const RoomCanvas = dynamic(() => import('@/components/room/RoomCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-slate-100 rounded-xl flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
    </div>
  ),
});

export default function Home() {
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapFurnitureId, setSwapFurnitureId] = useState<string | null>(null);

  const {
    roomConfig,
    furniture,
    currentStep,
    isGenerating,
    setFurniture,
    setIsGenerating,
    nextStep,
    setCurrentStep,
  } = useRoomStore();

  const canGenerate =
    roomConfig.type &&
    roomConfig.style &&
    roomConfig.dimensions &&
    roomConfig.dimensions.width > 0 &&
    roomConfig.dimensions.length > 0;

  const handleGenerateDesign = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Get recommended products
    const products = getRecommendedProducts(
      roomConfig.type!,
      roomConfig.style!,
      roomConfig.budget
    );

    // Create furniture items with positions
    const roomWidth = roomConfig.dimensions!.width * 30; // feet to pixels
    const roomLength = roomConfig.dimensions!.length * 30;

    const furnitureItems: FurnitureItem[] = products.slice(0, 6).map((product, index) => {
      const productWidth = inchesToPixels(product.width);
      const productDepth = inchesToPixels(product.depth);

      // Smart positioning based on furniture type
      let x = 0;
      let y = 0;

      switch (product.category) {
        case 'bed':
          x = (roomWidth - productWidth) / 2;
          y = 20;
          break;
        case 'sofa':
          x = (roomWidth - productWidth) / 2;
          y = roomLength - productDepth - 30;
          break;
        case 'desk':
        case 'dresser':
          x = 20;
          y = 20 + index * 80;
          break;
        case 'nightstand':
          x = index % 2 === 0 ? 20 : roomWidth - productWidth - 20;
          y = 100;
          break;
        case 'chair':
          x = roomWidth - productWidth - 40;
          y = 60 + index * 60;
          break;
        case 'table':
          x = (roomWidth - productWidth) / 2;
          y = (roomLength - productDepth) / 2;
          break;
        case 'rug':
          x = (roomWidth - productWidth) / 2;
          y = (roomLength - productDepth) / 2;
          break;
        default:
          x = 30 + (index % 3) * 100;
          y = 30 + Math.floor(index / 3) * 100;
      }

      return {
        id: `${product.id}-${generateId()}`,
        product,
        positionX: x,
        positionY: y,
        rotation: 0,
      };
    });

    setFurniture(furnitureItems);
    setIsGenerating(false);
    setCurrentStep(2);
  };

  const handleSwapClick = (furnitureId: string) => {
    setSwapFurnitureId(furnitureId);
    setSwapModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Design Your Perfect Room
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get customized furniture recommendations from IKEA, Amazon, and Wayfair.
            Visualize your space and shop with confidence.
          </p>
        </section>

        {/* Step 1: Configuration */}
        <section
          id="configure"
          className={`mb-12 transition-opacity ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white text-sm font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              Configure Your Room
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <RoomTypeSelector />
              <DimensionInput />
            </div>
            <div className="space-y-8">
              <StyleSelector />
              <BudgetSelector />
            </div>
          </div>

          {/* Generate button */}
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={handleGenerateDesign}
              disabled={!canGenerate || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Design...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Design
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Step 2: Design & Products */}
        {furniture.length > 0 && (
          <section id="design" className="mb-12 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white text-sm font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Your Room Design
              </h3>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Canvas */}
              <div className="lg:col-span-2">
                <RoomCanvas />
              </div>

              {/* Product list */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 max-h-[500px] overflow-hidden">
                <ProductList onSwapClick={handleSwapClick} />
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Checkout */}
        {furniture.length > 0 && (
          <section id="checkout" className="mb-12 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white text-sm font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Complete Your Purchase
              </h3>
            </div>

            <div className="max-w-md mx-auto">
              <PriceSummary />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500">
            RoomCraft - AI-Powered Interior Design
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Furniture from IKEA, Amazon, and Wayfair. Prices may vary.
          </p>
        </div>
      </footer>

      {/* Alternatives Modal */}
      <AlternativesModal
        isOpen={swapModalOpen}
        onClose={() => {
          setSwapModalOpen(false);
          setSwapFurnitureId(null);
        }}
        furnitureId={swapFurnitureId}
      />
    </div>
  );
}
