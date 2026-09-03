import React, { useState } from 'react';
import { House, Brain, Smile, Bell, Camera, Sparkles, Info } from 'lucide-react';
import HomePage from './components/HomePage.jsx';
import MemoryGames from './components/MemoryGames.jsx';
import MoodTracker from './components/MoodTracker.jsx';
import Reminders from './components/Reminders.jsx';
import PhotoMemories from './components/PhotoMemories.jsx';
import CalmingActivities from './components/CalmingActivities.jsx';
import AboutPage from './components/AboutPage.jsx';
import WellnessChatbot from './components/WellnessChatbot.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'games':
        return <MemoryGames onNavigate={setCurrentPage} />;
      case 'mood':
        return <MoodTracker onNavigate={setCurrentPage} />;
      case 'reminders':
        return <Reminders onNavigate={setCurrentPage} />;
      case 'memories':
        return <PhotoMemories onNavigate={setCurrentPage} />;
      case 'calming':
        return <CalmingActivities onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const navItems = [
    { id: 'home', icon: House, label: 'Home' },
    { id: 'games', icon: Brain, label: 'Games' },
    { id: 'mood', icon: Smile, label: 'Mood' },
    { id: 'reminders', icon: Bell, label: 'Reminders' },
    { id: 'memories', icon: Camera, label: 'Memories' },
    { id: 'calming', icon: Sparkles, label: 'Calming' },
    { id: 'about', icon: Info, label: 'About' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Main Content */}
      <div className="pb-24">
        {renderPage()}
      </div>

      {/* Bottom Navigation - Fixed and always visible */}
      <WellnessChatbot />

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-purple-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-7 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`
                    flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
