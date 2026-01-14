import React from 'react';
import { ClothingItem } from '../types';
import { X, Tag } from 'lucide-react';

interface ClothingItemCardProps {
  item: ClothingItem;
  onRemove?: (id: string) => void;
  isDraggable?: boolean;
  onClick?: (item: ClothingItem) => void;
}

const ClothingItemCard: React.FC<ClothingItemCardProps> = ({ 
  item, 
  onRemove, 
  isDraggable = true,
  onClick 
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'top':
        return '👕';
      case 'bottom':
        return '👖';
      case 'shoes':
        return '👟';
      case 'accessories':
        return '👜';
      default:
        return '👕';
    }
  };

  const getColorBadge = (color: string) => {
    const colorMap: { [key: string]: string } = {
      black: 'bg-black',
      white: 'bg-white border border-gray-300',
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-400',
      pink: 'bg-pink-400',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      brown: 'bg-amber-700',
      gray: 'bg-gray-500',
      navy: 'bg-blue-900',
      beige: 'bg-amber-100 border border-amber-300'
    };
    
    return colorMap[color] || 'bg-gray-300';
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 ${
        isDraggable ? 'hover:border-primary-300' : ''
      }`}
      onClick={() => onClick?.(item)}
      draggable={isDraggable}
      onDragStart={(e: React.DragEvent) => {
        if (isDraggable) {
          e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'clothing',
            item: item
          }));
        }
      }}
    >
      <div className="flex items-start space-x-3">
        {/* Image */}
        <div className="flex-shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-2xl">
              {getCategoryIcon(item.category)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {item.name}
          </h3>
          
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500 capitalize">
              {item.category}
            </span>
            <div className={`w-3 h-3 rounded-full ${getColorBadge(item.color)}`} />
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{item.tags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Remove Button */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ClothingItemCard;
