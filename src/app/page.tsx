'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import RoomTypeSelector from '@/components/design/RoomTypeSelector';
import StyleSelector from '@/components/design/StyleSelector';
import BudgetSelector from '@/components/design/BudgetSelector';
import DimensionInput from '@/components/design/DimensionInput';
import PhotoUpload from '@/components/room/PhotoUpload';
import ProductList from '@/components/products/ProductList';
import AlternativesModal from '@/components/products/AlternativesModal';
import PriceSummary from '@/components/products/PriceSummary';
import Button from '@/components/ui/Button';
import { useRoomStore } from '@/store/roomStore';
import { getRecommendedProducts } from '@/data/sampleProducts';
import { generateId, inchesToPixels } from '@/lib/utils';
import { FurnitureItem, Product } from '@/types';
import { Wand2, ArrowRight, Loader2, Camera, Settings2, Sparkles } from 'lucide-react';

// Dynamic import for Konva (client-side only)
const RoomCanvas = dynamic(() => import('@/components/room/RoomCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-slate-100 rounded-xl flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
    </div>
  ),
});

type InputMode = 'photo' | 'manual';

interface AIAnalysis {
  roomType: string;
  detectedStyle: string;
  dimensions: { estimatedWidth: number; estimatedLength: number };
  existingFurniture: string[];
  suggestedFurniture: { category: string; reason: string; priority: string }[];
  colorPalette: string[];
  overallAssessment: string;
}

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>('photo');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapFurnitureId, setSwapFurnitureId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    roomConfig,
    furniture,
    isGenerating,
    setFurniture,
    setIsGenerating,
    setRoomType,
    setStyle,
    setDimensions,
    setCurrentStep,
  } = useRoomStore();

  const canGenerateManual =
    roomConfig.type &&
    roomConfig.style &&
    roomConfig.dimensions &&
    roomConfig.dimensions.width > 0 &&
    roomConfig.dimensions.length > 0;

  // Analyze photo with AI
  const handleAnalyzePhoto = async () => {
    if (!uploadedPhoto) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedPhoto,
          preferences: {
            style: roomConfig.style,
            budget: roomConfig.budget,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAiAnalysis(data.analysis);

      // Update room config with AI-detected values
      if (data.analysis.roomType) {
        setRoomType(data.analysis.roomType);
      }
      if (data.analysis.detectedStyle) {
        setStyle(data.analysis.detectedStyle);
      }
      if (data.analysis.dimensions) {
        setDimensions({
          width: data.analysis.dimensions.estimatedWidth,
          length: data.analysis.dimensions.estimatedLength,
          height: 8,
        });
      }

      // Create furniture items from recommendations
      if (data.recommendations && data.recommendations.length > 0) {
        createFurnitureLayout(data.recommendations);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze photo');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Create furniture layout from products
  const createFurnitureLayout = (products: Product[]) => {
    const dims = roomConfig.dimensions || { width: 12, length: 14 };
    const roomWidth = dims.width * 30;
    const roomLength = dims.length * 30;

    // Track placed items for collision detection
    const placedItems: { x: number; y: number; width: number; height: number }[] = [];

    // Check if a position overlaps with any placed item
    const checkOverlap = (x: number, y: number, width: number, height: number): boolean => {
      const padding = 10; // Minimum gap between items
      for (const item of placedItems) {
        if (
          x < item.x + item.width + padding &&
          x + width + padding > item.x &&
          y < item.y + item.height + padding &&
          y + height + padding > item.y
        ) {
          return true;
        }
      }
      return false;
    };

    // Check if item fits in room at all
    const canFitInRoom = (width: number, height: number): boolean => {
      return width <= roomWidth - 20 && height <= roomLength - 20;
    };

    // Find a non-overlapping position, starting from preferred position
    // Returns null if no valid position found
    const findValidPosition = (
      preferredX: number,
      preferredY: number,
      width: number,
      height: number
    ): { x: number; y: number } | null => {
      // Check if item is too big for the room
      if (!canFitInRoom(width, height)) {
        return null;
      }

      // Try preferred position first
      if (!checkOverlap(preferredX, preferredY, width, height)) {
        return { x: preferredX, y: preferredY };
      }

      // Search in expanding squares around preferred position
      const step = 30;
      for (let radius = step; radius < Math.max(roomWidth, roomLength); radius += step) {
        // Try positions around the perimeter at this radius
        for (let dx = -radius; dx <= radius; dx += step) {
          for (let dy = -radius; dy <= radius; dy += step) {
            // Only check perimeter positions
            if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

            const testX = Math.max(10, Math.min(preferredX + dx, roomWidth - width - 10));
            const testY = Math.max(10, Math.min(preferredY + dy, roomLength - height - 10));

            if (!checkOverlap(testX, testY, width, height)) {
              return { x: testX, y: testY };
            }
          }
        }
      }

      // Fallback: grid search
      for (let gx = 10; gx < roomWidth - width - 10; gx += step) {
        for (let gy = 10; gy < roomLength - height - 10; gy += step) {
          if (!checkOverlap(gx, gy, width, height)) {
            return { x: gx, y: gy };
          }
        }
      }

      // No valid position found - item won't fit
      return null;
    };

    // Track category counts to offset items of the same type
    const categoryCount: Record<string, number> = {};

    const furnitureItems: FurnitureItem[] = products.slice(0, 8).map((product, index) => {
      const productWidth = inchesToPixels(product.width);
      const productDepth = inchesToPixels(product.depth);

      // Get and increment the count for this category
      const catIndex = categoryCount[product.category] || 0;
      categoryCount[product.category] = catIndex + 1;

      let preferredX = 0;
      let preferredY = 0;

      switch (product.category) {
        case 'bed':
          preferredX = (roomWidth - productWidth) / 2;
          preferredY = 20;
          break;
        case 'sofa':
          preferredX = (roomWidth - productWidth) / 2;
          preferredY = roomLength - productDepth - 30;
          break;
        case 'desk':
          preferredX = 20;
          preferredY = 20;
          break;
        case 'dresser':
          preferredX = 20;
          preferredY = roomLength / 2;
          break;
        case 'nightstand':
          preferredX = catIndex % 2 === 0 ? 20 : roomWidth - productWidth - 20;
          preferredY = 20;
          break;
        case 'chair':
          preferredX = roomWidth - productWidth - 40;
          preferredY = 60;
          break;
        case 'table':
          preferredX = (roomWidth - productWidth) / 2;
          preferredY = (roomLength - productDepth) / 2;
          break;
        case 'rug':
          preferredX = (roomWidth - productWidth) / 2;
          preferredY = (roomLength - productDepth) / 2;
          break;
        case 'lighting':
          const lampPositions = [
            { x: 20, y: 20 },
            { x: roomWidth - productWidth - 20, y: 20 },
            { x: 20, y: roomLength - productDepth - 20 },
            { x: roomWidth - productWidth - 20, y: roomLength - productDepth - 20 },
          ];
          const pos = lampPositions[catIndex % lampPositions.length];
          preferredX = pos.x;
          preferredY = pos.y;
          break;
        case 'bookshelf':
        case 'storage':
          preferredX = roomWidth - productWidth - 20;
          preferredY = 20;
          break;
        default:
          const col = index % 3;
          const row = Math.floor(index / 3);
          preferredX = 30 + col * (roomWidth / 3 - 20);
          preferredY = 30 + row * (roomLength / 4);
      }

      // Ensure preferred position is within bounds
      preferredX = Math.max(10, Math.min(preferredX, roomWidth - productWidth - 10));
      preferredY = Math.max(10, Math.min(preferredY, roomLength - productDepth - 10));

      // Find valid non-overlapping position
      const position = findValidPosition(preferredX, preferredY, productWidth, productDepth);

      // Skip this item if no valid position found (room is full)
      if (!position) {
        return null;
      }

      // Record this item's position for future collision checks
      placedItems.push({ x: position.x, y: position.y, width: productWidth, height: productDepth });

      return {
        id: `${product.id}-${generateId()}`,
        product,
        positionX: position.x,
        positionY: position.y,
        rotation: 0,
      };
    }).filter((item): item is FurnitureItem => item !== null);

    setFurniture(furnitureItems);
    setCurrentStep(2);
  };

  // Manual generation
  const handleGenerateDesign = async () => {
    if (!canGenerateManual) return;

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const products = getRecommendedProducts(
      roomConfig.type!,
      roomConfig.style!,
      roomConfig.budget
    );

    createFurnitureLayout(products);
    setIsGenerating(false);
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
            Upload a photo of your room and get AI-powered furniture recommendations
            from IKEA, Amazon, and Wayfair.
          </p>
        </section>

        {/* Step 1: Input Mode Selection */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white text-sm font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              Get Started
            </h3>
          </div>

          {/* Mode toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-white">
              <button
                onClick={() => setInputMode('photo')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  inputMode === 'photo'
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Camera className="h-4 w-4" />
                Upload Photo
              </button>
              <button
                onClick={() => setInputMode('manual')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  inputMode === 'manual'
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Settings2 className="h-4 w-4" />
                Manual Setup
              </button>
            </div>
          </div>

          {/* Photo upload mode */}
          {inputMode === 'photo' && (
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <PhotoUpload
                    onPhotoSelect={setUploadedPhoto}
                    onAnalyze={handleAnalyzePhoto}
                    isAnalyzing={isAnalyzing}
                    currentPhoto={uploadedPhoto}
                    onClear={() => {
                      setUploadedPhoto(null);
                      setAiAnalysis(null);
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <StyleSelector />
                  <BudgetSelector />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200 animate-fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-primary-600" />
                    <h4 className="font-semibold text-slate-900">AI Analysis</h4>
                  </div>

                  <p className="text-slate-600 mb-4">{aiAnalysis.overallAssessment}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Room Type:</span>
                      <span className="ml-2 font-medium capitalize">
                        {aiAnalysis.roomType?.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Style:</span>
                      <span className="ml-2 font-medium capitalize">
                        {aiAnalysis.detectedStyle}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Est. Size:</span>
                      <span className="ml-2 font-medium">
                        {aiAnalysis.dimensions?.estimatedWidth}' x {aiAnalysis.dimensions?.estimatedLength}'
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Suggestions:</span>
                      <span className="ml-2 font-medium">
                        {aiAnalysis.suggestedFurniture?.length || 0} items
                      </span>
                    </div>
                  </div>

                  {aiAnalysis.colorPalette && aiAnalysis.colorPalette.length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm text-slate-500">Recommended Colors:</span>
                      <div className="flex gap-2 mt-2">
                        {aiAnalysis.colorPalette.slice(0, 5).map((color, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border border-slate-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Manual setup mode */}
          {inputMode === 'manual' && (
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
          )}

          {/* Generate button for manual mode */}
          {inputMode === 'manual' && (
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                onClick={handleGenerateDesign}
                disabled={!canGenerateManual || isGenerating}
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
          )}
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
            Ave999Designs - Your AI interior design tool
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
