import { create } from 'zustand';
import {
  RoomConfig,
  FurnitureItem,
  RoomType,
  DesignStyle,
  RoomDimensions,
  Country,
  Product
} from '@/types';

interface RoomState {
  // Room configuration
  roomConfig: RoomConfig;

  // Furniture in the room
  furniture: FurnitureItem[];

  // Currently selected furniture item (for alternatives)
  selectedFurnitureId: string | null;

  // UI state
  currentStep: number;
  isGenerating: boolean;

  // Actions - Room Config
  setRoomType: (type: RoomType) => void;
  setDimensions: (dimensions: RoomDimensions) => void;
  setStyle: (style: DesignStyle) => void;
  setBudget: (budget: number) => void;
  setCountry: (country: Country) => void;
  setPhotoUrl: (url: string) => void;

  // Actions - Furniture
  setFurniture: (furniture: FurnitureItem[]) => void;
  addFurniture: (item: FurnitureItem) => void;
  removeFurniture: (id: string) => void;
  updateFurniturePosition: (id: string, x: number, y: number) => void;
  updateFurnitureRotation: (id: string, rotation: number) => void;
  swapFurniture: (oldId: string, newProduct: Product) => void;

  // Actions - Selection
  setSelectedFurniture: (id: string | null) => void;

  // Actions - UI
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setIsGenerating: (isGenerating: boolean) => void;

  // Computed
  getTotalCost: () => number;

  // Reset
  reset: () => void;
}

const initialRoomConfig: RoomConfig = {
  type: null,
  dimensions: null,
  style: null,
  budget: 5000,
  country: 'US',
};

export const useRoomStore = create<RoomState>((set, get) => ({
  roomConfig: initialRoomConfig,
  furniture: [],
  selectedFurnitureId: null,
  currentStep: 1,
  isGenerating: false,

  // Room Config Actions
  setRoomType: (type) => set((state) => ({
    roomConfig: { ...state.roomConfig, type }
  })),

  setDimensions: (dimensions) => set((state) => ({
    roomConfig: { ...state.roomConfig, dimensions }
  })),

  setStyle: (style) => set((state) => ({
    roomConfig: { ...state.roomConfig, style }
  })),

  setBudget: (budget) => set((state) => ({
    roomConfig: { ...state.roomConfig, budget }
  })),

  setCountry: (country) => set((state) => ({
    roomConfig: { ...state.roomConfig, country }
  })),

  setPhotoUrl: (photoUrl) => set((state) => ({
    roomConfig: { ...state.roomConfig, photoUrl }
  })),

  // Furniture Actions
  setFurniture: (furniture) => set({ furniture }),

  addFurniture: (item) => set((state) => ({
    furniture: [...state.furniture, item]
  })),

  removeFurniture: (id) => set((state) => ({
    furniture: state.furniture.filter((item) => item.id !== id)
  })),

  updateFurniturePosition: (id, x, y) => set((state) => ({
    furniture: state.furniture.map((item) =>
      item.id === id ? { ...item, positionX: x, positionY: y } : item
    )
  })),

  updateFurnitureRotation: (id, rotation) => set((state) => ({
    furniture: state.furniture.map((item) =>
      item.id === id ? { ...item, rotation } : item
    )
  })),

  swapFurniture: (oldId, newProduct) => set((state) => ({
    furniture: state.furniture.map((item) =>
      item.id === oldId
        ? {
            ...item,
            product: newProduct,
            id: `${newProduct.id}-${Date.now()}`
          }
        : item
    )
  })),

  // Selection Actions
  setSelectedFurniture: (id) => set({ selectedFurnitureId: id }),

  // UI Actions
  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, 4)
  })),

  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  })),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  // Computed
  getTotalCost: () => {
    const { furniture } = get();
    return furniture.reduce((total, item) => total + item.product.price, 0);
  },

  // Reset
  reset: () => set({
    roomConfig: initialRoomConfig,
    furniture: [],
    selectedFurnitureId: null,
    currentStep: 1,
    isGenerating: false,
  }),
}));
