import React from 'react';
import { Brain, Smile, Bell, Camera, Sparkles, Info, Heart } from 'lucide-react';

type Page = 'home' | 'games' | 'mood' | 'reminders' | 'memories' | 'calming' | 'about';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      id: 'games' as Page,
      icon: Brain,
      title: 'Memory Games',
      description: 'Exercise your mind with fun activities',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'mood' as Page,
      icon: Smile,
      title: 'Mood Tracker',
      description: 'Track how you feel each day',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'reminders' as Page,
      icon: Bell,
      title: 'Reminders',
      description: 'Set medicine and task reminders',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'memories' as Page,
      icon: Camera,
      title: 'Photo Memories',
      description: 'Save and view special moments',
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'calming' as Page,
      icon: Sparkles,
      title: 'Calming Activities',
      description: 'Relax with music and breathing',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'about' as Page,
      icon: Info,
      title: 'About',
      description: 'Learn about this app',
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-6 shadow-xl">
          <Heart className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Mind & Heart Wellness
        </h1>
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          Your daily companion for mental wellness and memory care
        </p>
      </div>

      {/* Feature Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          
          return (
            <button
              key={feature.id}
              onClick={() => onNavigate(feature.id)}
              className={`
                ${feature.bgColor} rounded-3xl p-8 shadow-lg 
                hover:shadow-2xl hover:scale-105 transition-all duration-300
                border-4 border-white
              `}
            >
              <div className={`
                w-20 h-20 mx-auto mb-6 rounded-2xl 
                bg-gradient-to-br ${feature.color}
                flex items-center justify-center shadow-lg
              `}>
                <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h2>
              
              <p className="text-lg text-gray-600">
                {feature.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Welcome Message */}
      <div className="max-w-4xl mx-auto mt-12 bg-white rounded-3xl p-8 shadow-lg border-4 border-purple-100">
        <p className="text-xl text-gray-700 text-center leading-relaxed">
          Welcome! This app is designed to help you stay mentally active, 
          track your emotions, remember important tasks, and find moments of calm. 
          Choose any activity above to get started.
        </p>
      </div>
    </div>
  );
}
