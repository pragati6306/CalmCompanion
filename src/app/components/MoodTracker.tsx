import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, TrendingUp } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

type Page = 'home' | 'games' | 'mood' | 'reminders' | 'memories' | 'calming' | 'about';

interface MoodTrackerProps {
  onNavigate: (page: Page) => void;
}

interface MoodEntry {
  emoji: string;
  note: string;
  timestamp: number;
}

export default function MoodTracker({ onNavigate }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '🤗', label: 'Grateful' },
    { emoji: '😤', label: 'Frustrated' }
  ];

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98afb243/moods`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success && data.moods) {
        // Sort by timestamp descending (newest first)
        const sorted = data.moods.sort((a: MoodEntry, b: MoodEntry) => b.timestamp - a.timestamp);
        setMoodHistory(sorted);
      }
    } catch (error) {
      console.error('Error fetching mood history:', error);
    }
  };

  const saveMood = async () => {
    if (!selectedMood) {
      alert('Please select a mood emoji');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98afb243/moods`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emoji: selectedMood,
            note: note.trim(),
            timestamp: Date.now(),
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setShowSuccess(true);
        setSelectedMood('');
        setNote('');
        fetchMoodHistory();
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        console.error('Error saving mood:', data.error);
        alert('Failed to save mood. Please try again.');
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('Failed to save mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

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
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-xl">
          <Calendar className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          How Are You Feeling?
        </h1>
        <p className="text-2xl text-gray-600">
          Track your mood each day
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="max-w-3xl mx-auto mb-8 bg-green-500 text-white p-6 rounded-3xl shadow-xl text-center border-4 border-white">
          <p className="text-2xl font-bold">✓ Mood saved successfully!</p>
        </div>
      )}

      {/* Mood Selection */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-3xl p-10 shadow-xl border-4 border-yellow-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Select Your Mood
          </h2>
          
          <div className="grid grid-cols-4 gap-6 mb-8">
            {moods.map((mood) => (
              <button
                key={mood.emoji}
                onClick={() => setSelectedMood(mood.emoji)}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center
                  transition-all duration-300 shadow-lg border-4
                  ${selectedMood === mood.emoji
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 scale-110'
                    : 'bg-gray-50 border-gray-200 hover:border-yellow-300 hover:scale-105'
                  }
                `}
              >
                <span className="text-5xl mb-2">{mood.emoji}</span>
                <span className="text-lg font-semibold text-gray-700">{mood.label}</span>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-2xl font-semibold text-gray-800 mb-4">
              Add a Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling today? What happened?"
              className="w-full px-6 py-4 text-xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-yellow-500 resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={saveMood}
            disabled={loading || !selectedMood}
            className={`
              w-full py-6 rounded-2xl text-2xl font-bold shadow-lg transition-all
              ${loading || !selectedMood
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-2xl hover:scale-105'
              }
            `}
          >
            {loading ? 'Saving...' : 'Save My Mood'}
          </button>
        </div>
      </div>

      {/* Mood History */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-purple-600" />
          <h2 className="text-4xl font-bold text-gray-800">
            Your Mood History
          </h2>
        </div>

        {moodHistory.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-lg text-center border-4 border-purple-100">
            <p className="text-2xl text-gray-600">
              No mood entries yet. Start tracking your mood above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {moodHistory.map((entry, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border-4 border-purple-50 hover:border-purple-200 transition-all"
              >
                <div className="flex items-start gap-6">
                  <div className="text-5xl">{entry.emoji}</div>
                  
                  <div className="flex-1">
                    <p className="text-xl text-gray-500 mb-2">
                      {formatDate(entry.timestamp)}
                    </p>
                    
                    {entry.note && (
                      <p className="text-xl text-gray-700 leading-relaxed">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
