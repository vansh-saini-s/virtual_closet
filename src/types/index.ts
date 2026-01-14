export interface ClothingItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessories';
  image: string;
  tags: string[];
  color: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  dateAdded: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: {
    top?: ClothingItem;
    bottom?: ClothingItem;
    shoes?: ClothingItem;
    accessories?: ClothingItem[];
  };
  dateCreated: string;
  tags: string[];
}

export interface DragItem {
  type: 'clothing';
  item: ClothingItem;
}

export interface OutfitCanvas {
  top?: ClothingItem;
  bottom?: ClothingItem;
  shoes?: ClothingItem;
  accessories: ClothingItem[];
}

export type ClothingCategory = 'top' | 'bottom' | 'shoes' | 'accessories';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';

