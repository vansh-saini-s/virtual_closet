import React from 'react';
import { useCloset } from '../context/ClosetContext';
import { ClothingItem } from '../types';
import { motion } from 'framer-motion';
import { Lightbulb, Shirt } from 'lucide-react';

const OutfitSuggestions: React.FC = () => {
  const { state, addToOutfit } = useCloset();

  const generateSuggestions = (): ClothingItem[][] => {
    const suggestions: ClothingItem[][] = [];
    
    // Get items by category
    const tops = state.clothingItems.filter(item => item.category === 'top');
    const bottoms = state.clothingItems.filter(item => item.category === 'bottom');
    const shoes = state.clothingItems.filter(item => item.category === 'shoes');
    const accessories = state.clothingItems.filter(item => item.category === 'accessories');

    // Generate color-coordinated outfits
    const colors = ['black', 'white', 'blue', 'red', 'gray'];
    
    colors.forEach(color => {
      const colorTops = tops.filter(item => item.color === color);
      const colorBottoms = bottoms.filter(item => item.color === color);
      const colorShoes = shoes.filter(item => item.color === color);
      const colorAccessories = accessories.filter(item => item.color === color);

      if (colorTops.length > 0 && colorBottoms.length > 0 && colorShoes.length > 0) {
        suggestions.push([
          colorTops[0],
          colorBottoms[0],
          colorShoes[0],
          ...(colorAccessories.length > 0 ? [colorAccessories[0]] : [])
        ]);
      }
    });

    // Generate casual outfits
    const casualTops = tops.filter(item => item.tags.includes('casual'));
    const casualBottoms = bottoms.filter(item => item.tags.includes('casual'));
    const casualShoes = shoes.filter(item => item.tags.includes('casual'));

    if (casualTops.length > 0 && casualBottoms.length > 0 && casualShoes.length > 0) {
      suggestions.push([
        casualTops[0],
        casualBottoms[0],
        casualShoes[0]
      ]);
    }

    // Generate formal outfits
    const formalTops = tops.filter(item => item.tags.includes('formal'));
    const formalBottoms = bottoms.filter(item => item.tags.includes('formal'));
    const formalShoes = shoes.filter(item => item.tags.includes('formal'));

    if (formalTops.length > 0 && formalBottoms.length > 0 && formalShoes.length > 0) {
      suggestions.push([
        formalTops[0],
        formalBottoms[0],
        formalShoes[0]
      ]);
    }

    return suggestions.slice(0, 3); // Return max 3 suggestions
  };

  const suggestions = generateSuggestions();

  const handleApplySuggestion = (suggestion: ClothingItem[]) => {
    suggestion.forEach(item => {
      addToOutfit(item.category as 'top' | 'bottom' | 'shoes' | 'accessories', item);
    });
  };

  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium text-gray-900">Outfit Suggestions</h3>
        </div>
        <p className="text-sm text-gray-500">
          Add more items to your closet to get outfit suggestions!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3 className="font-medium text-gray-900">Outfit Suggestions</h3>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Shirt className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Suggestion {index + 1}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestion.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-4 h-4 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs">
                        {item.category === 'top' ? '👕' : 
                         item.category === 'bottom' ? '👖' : 
                         item.category === 'shoes' ? '👟' : '👜'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 truncate max-w-20">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => handleApplySuggestion(suggestion)}
              className="w-full px-3 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
            >
              Apply This Outfit
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OutfitSuggestions;

