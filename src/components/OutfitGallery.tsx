import React, { useState } from 'react';
import { useCloset } from '../context/ClosetContext';
import { Outfit } from '../types';
import { motion } from 'framer-motion';
import { Trash2, Download, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';

const OutfitGallery: React.FC = () => {
  const { state, removeOutfit, setFilter } = useCloset();
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [showOutfitModal, setShowOutfitModal] = useState(false);

  const handleDeleteOutfit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this outfit?')) {
      removeOutfit(id);
    }
  };

  const handleViewOutfit = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setShowOutfitModal(true);
  };

  const handleDownloadOutfit = async (outfit: Outfit) => {
    // Create a temporary element to render the outfit
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '300px';
    tempDiv.style.height = '400px';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.padding = '20px';
    tempDiv.style.borderRadius = '8px';
    
    // Create outfit display
    const outfitDisplay = document.createElement('div');
    outfitDisplay.style.display = 'flex';
    outfitDisplay.style.flexDirection = 'column';
    outfitDisplay.style.alignItems = 'center';
    outfitDisplay.style.gap = '10px';
    
    // Add outfit items
    if (outfit.items.top) {
      const topImg = document.createElement('img');
      topImg.src = outfit.items.top.image;
      topImg.style.width = '100px';
      topImg.style.height = '80px';
      topImg.style.objectFit = 'cover';
      topImg.style.borderRadius = '4px';
      outfitDisplay.appendChild(topImg);
    }
    
    if (outfit.items.bottom) {
      const bottomImg = document.createElement('img');
      bottomImg.src = outfit.items.bottom.image;
      bottomImg.style.width = '100px';
      bottomImg.style.height = '80px';
      bottomImg.style.objectFit = 'cover';
      bottomImg.style.borderRadius = '4px';
      outfitDisplay.appendChild(bottomImg);
    }
    
    if (outfit.items.shoes) {
      const shoesImg = document.createElement('img');
      shoesImg.src = outfit.items.shoes.image;
      shoesImg.style.width = '100px';
      shoesImg.style.height = '60px';
      shoesImg.style.objectFit = 'cover';
      shoesImg.style.borderRadius = '4px';
      outfitDisplay.appendChild(shoesImg);
    }
    
    if (outfit.items.accessories && outfit.items.accessories.length > 0) {
      const accessoriesDiv = document.createElement('div');
      accessoriesDiv.style.display = 'flex';
      accessoriesDiv.style.gap = '5px';
      accessoriesDiv.style.flexWrap = 'wrap';
      accessoriesDiv.style.justifyContent = 'center';
      
      outfit.items.accessories.forEach(accessory => {
        const accImg = document.createElement('img');
        accImg.src = accessory.image;
        accImg.style.width = '40px';
        accImg.style.height = '40px';
        accImg.style.objectFit = 'cover';
        accImg.style.borderRadius = '4px';
        accessoriesDiv.appendChild(accImg);
      });
      
      outfitDisplay.appendChild(accessoriesDiv);
    }
    
    tempDiv.appendChild(outfitDisplay);
    document.body.appendChild(tempDiv);
    
    try {
      const canvas = await html2canvas(tempDiv);
      
      const link = document.createElement('a');
      link.download = `${outfit.name}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error downloading outfit:', error);
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  const getOutfitPreview = (outfit: Outfit) => {
    const items = [
      outfit.items.top,
      outfit.items.bottom,
      outfit.items.shoes,
      ...(outfit.items.accessories || [])
    ].filter(Boolean);

    return items.slice(0, 4); // Show max 4 items in preview
  };

  if (state.outfits.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <Eye className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No outfits yet</h3>
          <p className="text-gray-500 mb-4">Create your first outfit by dragging items to the canvas</p>
          <button
            onClick={() => setFilter({})}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Go to Closet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Outfits</h2>
          <p className="text-gray-600">Manage your saved outfit combinations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.outfits.map((outfit) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Outfit Preview */}
              <div className="p-4">
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  {getOutfitPreview(outfit).map((item, index) => (
                    <div key={index} className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                      {item?.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          {item?.category === 'top' ? '👕' : 
                           item?.category === 'bottom' ? '👖' : 
                           item?.category === 'shoes' ? '👟' : '👜'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <h3 className="font-medium text-gray-900 text-center mb-2 truncate">
                  {outfit.name}
                </h3>

                {/* Tags */}
                {outfit.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    {outfit.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {outfit.tags.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{outfit.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                  {new Date(outfit.dateCreated).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 p-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewOutfit(outfit)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownloadOutfit(outfit)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleDeleteOutfit(outfit.id)}
                    className="flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Outfit Detail Modal */}
      {showOutfitModal && selectedOutfit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedOutfit.name}
                </h3>
                <button
                  onClick={() => setShowOutfitModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Outfit Items */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedOutfit.items.top && (
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Top</h4>
                      <img
                        src={selectedOutfit.items.top.image}
                        alt={selectedOutfit.items.top.name}
                        className="w-24 h-24 object-cover rounded-md mx-auto"
                      />
                      <p className="text-xs text-gray-600 mt-1">{selectedOutfit.items.top.name}</p>
                    </div>
                  )}

                  {selectedOutfit.items.bottom && (
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Bottom</h4>
                      <img
                        src={selectedOutfit.items.bottom.image}
                        alt={selectedOutfit.items.bottom.name}
                        className="w-24 h-24 object-cover rounded-md mx-auto"
                      />
                      <p className="text-xs text-gray-600 mt-1">{selectedOutfit.items.bottom.name}</p>
                    </div>
                  )}

                  {selectedOutfit.items.shoes && (
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Shoes</h4>
                      <img
                        src={selectedOutfit.items.shoes.image}
                        alt={selectedOutfit.items.shoes.name}
                        className="w-24 h-24 object-cover rounded-md mx-auto"
                      />
                      <p className="text-xs text-gray-600 mt-1">{selectedOutfit.items.shoes.name}</p>
                    </div>
                  )}

                  {selectedOutfit.items.accessories && selectedOutfit.items.accessories.length > 0 && (
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Accessories</h4>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {selectedOutfit.items.accessories.map((accessory, index) => (
                          <img
                            key={index}
                            src={accessory.image}
                            alt={accessory.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {selectedOutfit.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedOutfit.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="text-sm text-gray-500">
                  Created: {new Date(selectedOutfit.dateCreated).toLocaleDateString()}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleDownloadOutfit(selectedOutfit)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setShowOutfitModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitGallery;
