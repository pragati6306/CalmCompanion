import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, Upload, Trash2, Heart } from 'lucide-react';
import { API_BASE_URL } from '../../config/api.js';

export default function PhotoMemories({ onNavigate }) {
  const [memories, setMemories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/memories`);
      const data = await response.json();
      if (data.success && data.memories) {
        const memoriesWithIds = data.memories
          .map((m) => ({
            ...m,
            id: m.id || `memory:${m.timestamp}`
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setMemories(memoriesWithIds);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large. Please choose under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addMemory = async () => {
    if (!caption.trim() && !selectedImage) {
      alert('Please add a caption or photo');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption: caption.trim(),
          photoBase64: selectedImage,
          timestamp: Date.now(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCaption('');
        setSelectedImage(null);
        setShowAddForm(false);
        fetchMemories();
      } else {
        alert('Failed to add memory.');
      }
    } catch (error) {
      console.error('Error adding memory:', error);
      alert('Failed to add memory.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMemory = async (memoryId) => {
    if (!confirm('Delete this memory?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/memories/${encodeURIComponent(memoryId)}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchMemories();
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mb-6 shadow-xl">
          <Camera className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Photo Memories
        </h1>
        <p className="text-2xl text-gray-600">
          Save your special moments
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-8 bg-gradient-to-r from-pink-400 to-pink-600 text-white px-8 py-4 rounded-3xl text-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
        >
          <Upload className="w-6 h-6" />
          Add Memory
        </button>

        {showAddForm && (
          <div className="bg-white rounded-3xl p-10 shadow-xl border-4 border-pink-100 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              New Memory
            </h2>

            {selectedImage && (
              <div className="mb-6">
                <img src={selectedImage} alt="preview" className="max-h-96 rounded-2xl mx-auto" />
              </div>
            )}

            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-6 py-4 border-4 border-dashed border-pink-300 rounded-2xl text-xl font-semibold text-pink-600 hover:bg-pink-50 transition-all"
              >
                Choose Photo
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-2xl font-semibold text-gray-800 mb-3">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe this memory..."
                className="w-full px-6 py-4 text-xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-pink-500 resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={addMemory}
                disabled={loading}
                className="flex-1 bg-pink-500 text-white px-6 py-4 rounded-2xl text-2xl font-bold hover:bg-pink-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Memory'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-4 rounded-2xl text-2xl font-bold hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {memories.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 shadow-lg text-center border-4 border-pink-100">
              <p className="text-2xl text-gray-600">No memories yet. Add your first one!</p>
            </div>
          ) : (
            memories.map((memory) => (
              <div
                key={memory.id}
                className="bg-white rounded-2xl p-6 shadow-lg border-4 border-pink-50 hover:border-pink-200 transition-all"
              >
                {memory.photoUrl && (
                  <img src={memory.photoUrl} alt="memory" className="w-full max-h-96 rounded-2xl mb-4 object-cover" />
                )}
                <p className="text-sm text-gray-500 mb-2">{formatDate(memory.timestamp)}</p>
                <p className="text-xl text-gray-700 mb-4">{memory.caption}</p>
                <button
                  onClick={() => deleteMemory(memory.id)}
                  className="bg-red-200 text-red-800 px-4 py-2 rounded-2xl hover:bg-red-300 transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
