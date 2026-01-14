import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ClothingItem, Outfit, OutfitCanvas } from '../types';

interface ClosetState {
  clothingItems: ClothingItem[];
  outfits: Outfit[];
  currentOutfit: OutfitCanvas;
  selectedCategory: string;
  selectedColor: string;
  searchQuery: string;
}

type ClosetAction =
  | { type: 'ADD_CLOTHING_ITEM'; payload: ClothingItem }
  | { type: 'REMOVE_CLOTHING_ITEM'; payload: string }
  | { type: 'UPDATE_CLOTHING_ITEM'; payload: ClothingItem }
  | { type: 'ADD_OUTFIT'; payload: Outfit }
  | { type: 'REMOVE_OUTFIT'; payload: string }
  | { type: 'UPDATE_OUTFIT'; payload: Outfit }
  | { type: 'SET_CURRENT_OUTFIT'; payload: OutfitCanvas }
  | { type: 'ADD_TO_OUTFIT'; payload: { category: keyof OutfitCanvas; item: ClothingItem } }
  | { type: 'REMOVE_FROM_OUTFIT'; payload: { category: keyof OutfitCanvas; itemId?: string } }
  | { type: 'CLEAR_OUTFIT' }
  | { type: 'SET_FILTER'; payload: { category?: string; color?: string; search?: string } }
  | { type: 'LOAD_DATA'; payload: { clothingItems: ClothingItem[]; outfits: Outfit[] } };

const initialState: ClosetState = {
  clothingItems: [],
  outfits: [],
  currentOutfit: {
    accessories: []
  },
  selectedCategory: 'all',
  selectedColor: 'all',
  searchQuery: ''
};

function closetReducer(state: ClosetState, action: ClosetAction): ClosetState {
  switch (action.type) {
    case 'ADD_CLOTHING_ITEM':
      return {
        ...state,
        clothingItems: [...state.clothingItems, action.payload]
      };
    
    case 'REMOVE_CLOTHING_ITEM':
      return {
        ...state,
        clothingItems: state.clothingItems.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_CLOTHING_ITEM':
      return {
        ...state,
        clothingItems: state.clothingItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    
    case 'ADD_OUTFIT':
      return {
        ...state,
        outfits: [...state.outfits, action.payload]
      };
    
    case 'REMOVE_OUTFIT':
      return {
        ...state,
        outfits: state.outfits.filter(outfit => outfit.id !== action.payload)
      };
    
    case 'UPDATE_OUTFIT':
      return {
        ...state,
        outfits: state.outfits.map(outfit =>
          outfit.id === action.payload.id ? action.payload : outfit
        )
      };
    
    case 'SET_CURRENT_OUTFIT':
      return {
        ...state,
        currentOutfit: action.payload
      };
    
    case 'ADD_TO_OUTFIT':
      const { category, item } = action.payload;
      if (category === 'accessories') {
        return {
          ...state,
          currentOutfit: {
            ...state.currentOutfit,
            accessories: [...state.currentOutfit.accessories, item]
          }
        };
      } else {
        return {
          ...state,
          currentOutfit: {
            ...state.currentOutfit,
            [category]: item
          }
        };
      }
    
    case 'REMOVE_FROM_OUTFIT':
      const { category: removeCategory, itemId } = action.payload;
      if (removeCategory === 'accessories') {
        return {
          ...state,
          currentOutfit: {
            ...state.currentOutfit,
            accessories: state.currentOutfit.accessories.filter(acc => acc.id !== itemId)
          }
        };
      } else {
        return {
          ...state,
          currentOutfit: {
            ...state.currentOutfit,
            [removeCategory]: undefined
          }
        };
      }
    
    case 'CLEAR_OUTFIT':
      return {
        ...state,
        currentOutfit: { accessories: [] }
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        selectedCategory: action.payload.category ?? state.selectedCategory,
        selectedColor: action.payload.color ?? state.selectedColor,
        searchQuery: action.payload.search ?? state.searchQuery
      };
    
    case 'LOAD_DATA':
      return {
        ...state,
        clothingItems: action.payload.clothingItems,
        outfits: action.payload.outfits
      };
    
    default:
      return state;
  }
}

interface ClosetContextType {
  state: ClosetState;
  dispatch: React.Dispatch<ClosetAction>;
  addClothingItem: (item: Omit<ClothingItem, 'id' | 'dateAdded'>) => void;
  removeClothingItem: (id: string) => void;
  updateClothingItem: (item: ClothingItem) => void;
  addOutfit: (outfit: Omit<Outfit, 'id' | 'dateCreated'>) => void;
  removeOutfit: (id: string) => void;
  updateOutfit: (outfit: Outfit) => void;
  addToOutfit: (category: keyof OutfitCanvas, item: ClothingItem) => void;
  removeFromOutfit: (category: keyof OutfitCanvas, itemId?: string) => void;
  clearOutfit: () => void;
  saveCurrentOutfit: (name: string, tags?: string[]) => void;
  setFilter: (filters: { category?: string; color?: string; search?: string }) => void;
  getFilteredItems: () => ClothingItem[];
}

const ClosetContext = createContext<ClosetContextType | undefined>(undefined);

export const useCloset = () => {
  const context = useContext(ClosetContext);
  if (context === undefined) {
    throw new Error('useCloset must be used within a ClosetProvider');
  }
  return context;
};

interface ClosetProviderProps {
  children: ReactNode;
}

export const ClosetProvider: React.FC<ClosetProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(closetReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedClothingItems = localStorage.getItem('virtual-closet-items');
    const savedOutfits = localStorage.getItem('virtual-closet-outfits');
    
    if (savedClothingItems || savedOutfits) {
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          clothingItems: savedClothingItems ? JSON.parse(savedClothingItems) : [],
          outfits: savedOutfits ? JSON.parse(savedOutfits) : []
        }
      });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('virtual-closet-items', JSON.stringify(state.clothingItems));
  }, [state.clothingItems]);

  useEffect(() => {
    localStorage.setItem('virtual-closet-outfits', JSON.stringify(state.outfits));
  }, [state.outfits]);

  const addClothingItem = (item: Omit<ClothingItem, 'id' | 'dateAdded'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    };
    dispatch({ type: 'ADD_CLOTHING_ITEM', payload: newItem });
  };

  const removeClothingItem = (id: string) => {
    dispatch({ type: 'REMOVE_CLOTHING_ITEM', payload: id });
  };

  const updateClothingItem = (item: ClothingItem) => {
    dispatch({ type: 'UPDATE_CLOTHING_ITEM', payload: item });
  };

  const addOutfit = (outfit: Omit<Outfit, 'id' | 'dateCreated'>) => {
    const newOutfit: Outfit = {
      ...outfit,
      id: Date.now().toString(),
      dateCreated: new Date().toISOString()
    };
    dispatch({ type: 'ADD_OUTFIT', payload: newOutfit });
  };

  const removeOutfit = (id: string) => {
    dispatch({ type: 'REMOVE_OUTFIT', payload: id });
  };

  const updateOutfit = (outfit: Outfit) => {
    dispatch({ type: 'UPDATE_OUTFIT', payload: outfit });
  };

  const addToOutfit = (category: keyof OutfitCanvas, item: ClothingItem) => {
    dispatch({ type: 'ADD_TO_OUTFIT', payload: { category, item } });
  };

  const removeFromOutfit = (category: keyof OutfitCanvas, itemId?: string) => {
    dispatch({ type: 'REMOVE_FROM_OUTFIT', payload: { category, itemId } });
  };

  const clearOutfit = () => {
    dispatch({ type: 'CLEAR_OUTFIT' });
  };

  const saveCurrentOutfit = (name: string, tags: string[] = []) => {
    const outfit: Omit<Outfit, 'id' | 'dateCreated'> = {
      name,
      items: state.currentOutfit,
      tags
    };
    addOutfit(outfit);
  };

  const setFilter = (filters: { category?: string; color?: string; search?: string }) => {
    dispatch({ type: 'SET_FILTER', payload: filters });
  };

  const getFilteredItems = (): ClothingItem[] => {
    return state.clothingItems.filter(item => {
      const matchesCategory = state.selectedCategory === 'all' || item.category === state.selectedCategory;
      const matchesColor = state.selectedColor === 'all' || item.color === state.selectedColor;
      const matchesSearch = state.searchQuery === '' || 
        item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()));
      
      return matchesCategory && matchesColor && matchesSearch;
    });
  };

  const value: ClosetContextType = {
    state,
    dispatch,
    addClothingItem,
    removeClothingItem,
    updateClothingItem,
    addOutfit,
    removeOutfit,
    updateOutfit,
    addToOutfit,
    removeFromOutfit,
    clearOutfit,
    saveCurrentOutfit,
    setFilter,
    getFilteredItems
  };

  return (
    <ClosetContext.Provider value={value}>
      {children}
    </ClosetContext.Provider>
  );
};

