import React from 'react';
import { ArrowLeft, Heart, Shield, Users, Sparkles, Brain, Info } from 'lucide-react';

type Page = 'home' | 'games' | 'mood' | 'reminders' | 'memories' | 'calming' | 'about';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen px-6 py-8">
      <button
        onClick={() => onNavigate('home')}
        className="mb-6 flex items-center gap-3 text-2xl text-gray-700 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-8 h-8" />
        <span className="font-semibold">Back to Home</span>
      </button>

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mb-6 shadow-xl">
          <Info className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          About This App
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
          A comprehensive mental wellness companion designed with seniors and cognitive care in mind
        </p>
      </div>

      {/* Mission Statement */}
      <div className="max-w-4xl mx-auto mb-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-10 shadow-xl border-4 border-white">
        <div className="flex items-center gap-4 mb-6">
          <Heart className="w-12 h-12 text-purple-600" />
          <h2 className="text-4xl font-bold text-gray-800">Our Mission</h2>
        </div>
        <p className="text-2xl text-gray-700 leading-relaxed">
          We believe everyone deserves accessible tools to support their mental wellness and 
          cognitive health. This app was created to provide a safe, friendly space for memory 
          exercises, emotional tracking, and moments of calm.
        </p>
      </div>

      {/* Features Overview */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          What This App Offers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-blue-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Memory Games</h3>
            </div>
            <p className="text-xl text-gray-600">
              Engaging card matching and word recall exercises designed to keep your mind active 
              and sharp through fun, accessible gameplay.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-yellow-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">😊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Mood Tracking</h3>
            </div>
            <p className="text-xl text-gray-600">
              Log your daily emotions with simple emoji selection. View your mood history to 
              understand patterns and share insights with caregivers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-green-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">💊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Smart Reminders</h3>
            </div>
            <p className="text-xl text-gray-600">
              Never miss important medications or daily tasks. Set custom reminders that alert 
              you at the right time with browser notifications.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-pink-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Photo Memories</h3>
            </div>
            <p className="text-xl text-gray-600">
              Create a digital memory board with photos and captions. Preserve cherished moments 
              and revisit them anytime for comfort and joy.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-purple-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Calming Activities</h3>
            </div>
            <p className="text-xl text-gray-600">
              Reduce stress and anxiety with guided breathing exercises and relaxing music. 
              Find peace whenever you need it most.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-indigo-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Senior-Friendly Design</h3>
            </div>
            <p className="text-xl text-gray-600">
              Large buttons, high contrast colors, clear navigation, and readable text make 
              every feature accessible and easy to use.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Safety */}
      <div className="max-w-4xl mx-auto mb-12 bg-white rounded-3xl p-10 shadow-xl border-4 border-green-100">
        <div className="flex items-center gap-4 mb-6">
          <Shield className="w-12 h-12 text-green-600" />
          <h2 className="text-4xl font-bold text-gray-800">Privacy & Safety</h2>
        </div>
        <div className="space-y-4 text-xl text-gray-700">
          <p>
            <strong>🔒 Your data is secure:</strong> All mood entries, reminders, and memories 
            are stored securely in a protected database.
          </p>
          <p>
            <strong>⚠️ Educational Use:</strong> This app is designed for educational and 
            prototype purposes. It should not be used to store sensitive medical information or 
            personally identifiable data that requires HIPAA compliance.
          </p>
          <p>
            <strong>💙 Made with Care:</strong> Every feature was designed with input from 
            caregivers and cognitive health specialists to ensure accessibility and usefulness.
          </p>
        </div>
      </div>

      {/* Future Improvements */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-10 shadow-xl border-4 border-blue-100">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Future Enhancements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <strong>AI Emotion Analysis:</strong> Detect emotions from mood notes to provide 
              better insights
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">👨‍👩‍👧</span>
            <div>
              <strong>Caregiver Login:</strong> Allow family members to monitor wellness from 
              their own dashboard
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <strong>Progress Reports:</strong> Generate weekly summaries of mood trends and 
              game performance
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🗣️</span>
            <div>
              <strong>Voice Commands:</strong> Add text-to-speech and voice control for hands-free 
              operation
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <strong>Mobile App:</strong> Native iOS and Android apps with push notifications
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <strong>Personalized Games:</strong> Adaptive difficulty based on user performance
            </div>
          </div>
        </div>
      </div>

      {/* Contact/Support */}
      <div className="max-w-4xl mx-auto mt-12 text-center bg-white rounded-3xl p-10 shadow-lg border-4 border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Thank You for Using Our App
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed">
          Your mental wellness journey matters. We hope this app brings comfort, joy, and 
          peace to your daily routine. Remember to be kind to yourself and celebrate small victories.
        </p>
        <div className="mt-6 text-4xl">💙</div>
      </div>
    </div>
  );
}
