import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Calendar, TrendingUp, BarChart3, Brain, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../../config/api.js';

const moodScores = {
  '😊': 5,
  '😌': 4,
  '😐': 3,
  '😔': 2,
  '😰': 1,
  '😴': 2,
  '🤗': 5,
  '😤': 1,
};

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤗', label: 'Grateful' },
  { emoji: '😤', label: 'Frustrated' },
];

export default function MoodTracker({ onNavigate }) {
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/moods`);
      const data = await response.json();
      if (data.success && data.moods) {
        const sorted = data.moods.sort((a, b) => b.timestamp - a.timestamp);
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
      const response = await fetch(`${API_BASE_URL}/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emoji: selectedMood,
          note: note.trim(),
          timestamp: Date.now(),
        }),
      });

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

  const analytics = useMemo(() => {
    if (moodHistory.length === 0) {
      return {
        averageScore: 0,
        mostCommonMood: 'No data',
        weeklyEntries: 0,
        weeklyInsight: 'Start tracking your mood to unlock insights.',
        weeklyData: Array.from({ length: 7 }, (_, index) => ({
          label: new Date(Date.now() - (6 - index) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
          score: 0,
          count: 0,
        })),
      };
    }

    const scores = moodHistory.map((entry) => moodScores[entry.emoji] ?? 3);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    const frequencyMap = {};
    moodHistory.forEach((entry) => {
      const emoji = entry.emoji;
      frequencyMap[emoji] = (frequencyMap[emoji] || 0) + 1;
    });

    const mostCommonMood = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '😊';

    const now = Date.now();
    const oneWeekAgo = now - 6 * 24 * 60 * 60 * 1000;
    const weeklyEntries = moodHistory.filter((entry) => entry.timestamp >= oneWeekAgo).length;

    const weeklyData = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      const start = new Date(date).getTime();
      const end = start + 24 * 60 * 60 * 1000;
      const entries = moodHistory.filter((entry) => entry.timestamp >= start && entry.timestamp < end);
      const avg = entries.length
        ? entries.reduce((sum, entry) => sum + (moodScores[entry.emoji] ?? 3), 0) / entries.length
        : 0;

      return {
        label: new Date(start).toLocaleDateString('en-US', { weekday: 'short' }),
        score: avg,
        count: entries.length,
      };
    });

    let weeklyInsight = 'Your mood is being tracked consistently.';
    if (weeklyEntries > 0) {
      const positiveDays = weeklyData.filter((day) => day.score >= 3.5).length;
      const averageMood = averageScore >= 3.5 ? 'generally uplifting' : averageScore >= 2.5 ? 'fairly balanced' : 'more challenging';
      weeklyInsight = `This week shows ${positiveDays} positive day${positiveDays === 1 ? '' : 's'} and an overall mood that feels ${averageMood}.`;
    }

    return {
      averageScore,
      mostCommonMood,
      weeklyEntries,
      weeklyInsight,
      weeklyData,
    };
  }, [moodHistory]);

  const formatDate = (timestamp) => {
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
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const averageMoodEmoji =
    analytics.averageScore >= 4.5 ? '😊' : analytics.averageScore >= 3.5 ? '😌' : analytics.averageScore >= 2.5 ? '😐' : '😔';

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

      {showSuccess && (
        <div className="max-w-3xl mx-auto mb-8 bg-green-500 text-white p-6 rounded-3xl shadow-xl text-center border-4 border-white">
          <p className="text-2xl font-bold">✓ Mood saved successfully!</p>
        </div>
      )}

      {moodHistory.length > 0 && (
        <div className="max-w-6xl mx-auto mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border-4 border-purple-100 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-semibold text-gray-500">Average mood</p>
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl">{averageMoodEmoji}</span>
              <div>
                <p className="text-3xl font-bold text-gray-800">{analytics.averageScore.toFixed(1)}</p>
                <p className="text-sm text-gray-500">out of 5</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-4 border-yellow-100 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-semibold text-gray-500">Most common</p>
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl">{analytics.mostCommonMood}</span>
              <div>
                <p className="text-2xl font-bold text-gray-800">Mood</p>
                <p className="text-sm text-gray-500">tracked most often</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-4 border-green-100 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-semibold text-gray-500">This week</p>
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl">{analytics.weeklyEntries}</span>
              <div>
                <p className="text-2xl font-bold text-gray-800">entries</p>
                <p className="text-sm text-gray-500">last 7 days</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {moodHistory.length > 0 && (
        <div className="max-w-6xl mx-auto mb-12 rounded-3xl border-4 border-purple-100 bg-white p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-7 w-7 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Mood trend</h2>
          </div>

          <div className="flex h-40 items-end gap-3">
            {analytics.weeklyData.map((day) => (
              <div key={day.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-28 w-full items-end justify-center">
                  <div
                    className={`w-full rounded-t-2xl ${day.score >= 3.5 ? 'bg-gradient-to-t from-green-400 to-emerald-300' : day.score >= 2.5 ? 'bg-gradient-to-t from-yellow-400 to-orange-300' : 'bg-gradient-to-t from-pink-400 to-red-300'}`}
                    style={{ height: `${Math.max((day.score / 5) * 100, day.count > 0 ? 18 : 8)}%` }}
                    title={`${day.label}: ${day.score.toFixed(1)} average`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">{day.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-purple-50 p-4 text-lg text-gray-700">
            <strong className="text-purple-700">AI insight:</strong> {analytics.weeklyInsight}
          </div>
        </div>
      )}

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
                key={`${entry.timestamp}-${index}`}
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
