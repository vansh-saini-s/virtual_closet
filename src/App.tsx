import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClosetProvider, useCloset } from './context/ClosetContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import OutfitCanvas from './components/OutfitCanvas';
import OutfitGallery from './components/OutfitGallery';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';
import { sampleClothingItems } from './data/sampleData';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'closet' | 'outfits'>('closet');
  const { addClothingItem, state } = useCloset();

  // Initialize with sample data if no items exist
  useEffect(() => {
    if (state.clothingItems.length === 0) {
      sampleClothingItems.forEach(item => {
        addClothingItem(item);
      });
    }
  }, [addClothingItem, state.clothingItems.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 flex flex-col">
          {activeTab === 'closet' ? (
            <OutfitCanvas />
          ) : (
            <OutfitGallery />
          )}
        </main>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ClosetProvider>
                  <AppContent />
                </ClosetProvider>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;