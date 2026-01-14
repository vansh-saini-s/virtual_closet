import React, { useState } from 'react';
import { useCloset } from '../context/ClosetContext';
import ClothingItemCard from './ClothingItemCard';
import AddItemModal from './AddItemModal';
import FilterControls from './FilterControls';
import { Plus, Search } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { getFilteredItems } = useCloset();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = getFilteredItems();

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Update the context with the search query
    // This will be handled by the FilterControls component
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Closet</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <FilterControls searchQuery={searchQuery} />

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">No items found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or add some items</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <ClothingItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;

