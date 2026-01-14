import React, { useState } from 'react';
import { useCloset } from '../context/ClosetContext';
import { ClothingItem } from '../types';
import { Save, Trash2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import OutfitSuggestions from './OutfitSuggestions';

const OutfitCanvas: React.FC = () => {
  const { state, addToOutfit, removeFromOutfit, clearOutfit, saveCurrentOutfit } = useCloset();
  const [isSaving, setIsSaving] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleDrop = (e: React.DragEvent, category: 'top' | 'bottom' | 'shoes' | 'accessories') => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    
    try {
      const { type, item }: { type: string; item: ClothingItem } = JSON.parse(data);
      if (type === 'clothing') {
        addToOutfit(category, item);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSaveOutfit = () => {
    if (!outfitName.trim()) return;
    
    setIsSaving(true);
    const tags = ['outfit']; // You could add more sophisticated tag generation
    saveCurrentOutfit(outfitName.trim(), tags);
    
    setOutfitName('');
    setShowSaveModal(false);
    setIsSaving(false);
  };

  const handleDownloadOutfit = async () => {
    const canvas = document.getElementById('outfit-canvas');
    if (!canvas) return;

    try {
      const canvasElement = await html2canvas(canvas as HTMLElement);
      
      const link = document.createElement('a');
      link.download = `outfit-${Date.now()}.png`;
      link.href = canvasElement.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error downloading outfit:', error);
    }
  };


  const getDropZoneText = (category: string) => {
    switch (category) {
      case 'top':
        return 'Drop tops here';
      case 'bottom':
        return 'Drop bottoms here';
      case 'shoes':
        return 'Drop shoes here';
      case 'accessories':
        return 'Drop accessories here';
      default:
        return 'Drop items here';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Outfit Creator</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSaveModal(true)}
              disabled={!state.currentOutfit.top && !state.currentOutfit.bottom && !state.currentOutfit.shoes && state.currentOutfit.accessories.length === 0}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Outfit</span>
            </button>
            <button
              onClick={handleDownloadOutfit}
              disabled={!state.currentOutfit.top && !state.currentOutfit.bottom && !state.currentOutfit.shoes && state.currentOutfit.accessories.length === 0}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            <button
              onClick={clearOutfit}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Main Canvas */}
          <div className="lg:col-span-2">
            <div
              id="outfit-canvas"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 h-full"
            >
          {/* Mannequin/Outfit Display */}
          <div className="flex justify-center items-center h-full">
            <div className="relative">
              {/* Mannequin Base */}
              <div className="w-64 h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                {/* Top Section */}
                <div
                  className="w-32 h-24 mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                  onDrop={(e) => handleDrop(e, 'top')}
                  onDragOver={handleDragOver}
                >
                  {state.currentOutfit.top ? (
                    <div className="relative group">
                      <img
                        src={state.currentOutfit.top.image}
                        alt={state.currentOutfit.top.name}
                        className="w-24 h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => removeFromOutfit('top')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">{getDropZoneText('top')}</span>
                  )}
                </div>

                {/* Bottom Section */}
                <div
                  className="w-32 h-24 mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                  onDrop={(e) => handleDrop(e, 'bottom')}
                  onDragOver={handleDragOver}
                >
                  {state.currentOutfit.bottom ? (
                    <div className="relative group">
                      <img
                        src={state.currentOutfit.bottom.image}
                        alt={state.currentOutfit.bottom.name}
                        className="w-24 h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => removeFromOutfit('bottom')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">{getDropZoneText('bottom')}</span>
                  )}
                </div>

                {/* Shoes Section */}
                <div
                  className="w-32 h-16 mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                  onDrop={(e) => handleDrop(e, 'shoes')}
                  onDragOver={handleDragOver}
                >
                  {state.currentOutfit.shoes ? (
                    <div className="relative group">
                      <img
                        src={state.currentOutfit.shoes.image}
                        alt={state.currentOutfit.shoes.name}
                        className="w-24 h-12 object-cover rounded"
                      />
                      <button
                        onClick={() => removeFromOutfit('shoes')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">{getDropZoneText('shoes')}</span>
                  )}
                </div>

                {/* Accessories Section */}
                <div
                  className="w-32 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                  onDrop={(e) => handleDrop(e, 'accessories')}
                  onDragOver={handleDragOver}
                >
                  {state.currentOutfit.accessories.length > 0 ? (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {state.currentOutfit.accessories.map((accessory, index) => (
                        <div key={accessory.id} className="relative group">
                          <img
                            src={accessory.image}
                            alt={accessory.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <button
                            onClick={() => removeFromOutfit('accessories', accessory.id)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">{getDropZoneText('accessories')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>
          
          {/* Outfit Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <OutfitSuggestions />
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Outfit</h3>
              <input
                type="text"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="Enter outfit name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOutfit}
                  disabled={!outfitName.trim() || isSaving}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitCanvas;
