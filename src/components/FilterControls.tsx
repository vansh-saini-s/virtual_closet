import React, { useCallback } from 'react';
import { useCloset } from '../context/ClosetContext';

interface FilterControlsProps {
  searchQuery: string;
}

const FilterControls: React.FC<FilterControlsProps> = ({ searchQuery }) => {
  const { state, setFilter } = useCloset();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'top', label: 'Tops' },
    { value: 'bottom', label: 'Bottoms' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const colors = [
    { value: 'all', label: 'All Colors' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'pink', label: 'Pink' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' },
    { value: 'brown', label: 'Brown' },
    { value: 'gray', label: 'Gray' },
    { value: 'navy', label: 'Navy' },
    { value: 'beige', label: 'Beige' }
  ];

  const handleCategoryChange = (category: string) => {
    setFilter({ category, search: searchQuery });
  };

  const handleColorChange = (color: string) => {
    setFilter({ color, search: searchQuery });
  };

  const handleSearchChange = useCallback((search: string) => {
    setFilter({ search, category: state.selectedCategory, color: state.selectedColor });
  }, [setFilter, state.selectedCategory, state.selectedColor]);

  // Update search when searchQuery prop changes
  React.useEffect(() => {
    handleSearchChange(searchQuery);
  }, [searchQuery, handleSearchChange]);

  return (
    <div className="p-4 border-b border-gray-200 space-y-4">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={state.selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Color Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <select
          value={state.selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {colors.map((color) => (
            <option key={color.value} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
