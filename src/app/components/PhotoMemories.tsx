import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, Upload, Trash2, Heart } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

type Page = 'home' | 'games' | 'mood' | 'reminders' | 'memories' | 'calming' | 'about';

interface PhotoMemoriesProps {
  onNavigate: (page: Page) => void;
}

interface Memory {
  id?: string;
  caption: string;
  photoPath?: string | null;
  photoUrl?: string;
  timestamp: number;
}

export default function PhotoMemories({ onNavigate }: PhotoMemoriesProps) {
  const [memories, setMemories] = useState<(Memory & { id: string })[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98afb243/memories`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success && data.memories) {
        // Transform memories to include their keys as IDs and sort by timestamp
        const memoriesWithIds = data.memories
          .map((m: any) => ({
            ...m,
            id: m.id || `memory:${m.timestamp}`
          }))
          .sort((a: Memory, b: Memory) => b.timestamp - a.timestamp);
        setMemories(memoriesWithIds);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large. Please choose an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98afb243/memories`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            caption: caption.trim(),
            photoBase64: selectedImage,
            timestamp: Date.now(),
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setCaption('');
        setSelectedImage(null);
        setShowAddForm(false);
        fetchMemories();
      } else {
        alert('Failed to add memory. Please try again.');
      }
    } catch (error) {
      console.error('Error adding memory:', error);
      alert('Failed to add memory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMemory = async (memoryId: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98afb243/memories/${encodeURIComponent(memoryId)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        fetchMemories();
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const formatDate = (timestamp: number) => {
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
          Save and cherish special moments
        </p>
      </div>

      {/* Add Memory Button */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-gradient-to-r from-pink-400 to-pink-600 hover:shadow-2xl text-white py-6 rounded-2xl text-2xl font-bold shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-105"
        >
          <Camera className="w-8 h-8" />
          Add New Memory
        </button>
      </div>

      {/* Add Memory Form */}
      {showAddForm && (
        <div className="max-w-6xl mx-auto mb-12 bg-white rounded-3xl p-10 shadow-xl border-4 border-pink-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">New Memory</h2>
          
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-2xl font-semibold text-gray-800 mb-4">
              Add a Photo
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            {selectedImage ? (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-96 object-cover rounded-2xl border-4 border-gray-300"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl shadow-lg transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-96 border-4 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-pink-400 hover:bg-pink-50 transition-all"
              >
                <Upload className="w-16 h-16 text-gray-400" />
                <span className="text-2xl text-gray-600 font-semibold">
                  Click to upload a photo
                </span>
                <span className="text-xl text-gray-500">
                  (Max 5MB)
                </span>
              </button>
            )}
          </div>

          {/* Caption */}
          <div className="mb-8">
            <label className="block text-2xl font-semibold text-gray-800 mb-4">
              Caption or Memory Description
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe this special moment..."
              className="w-full px-6 py-4 text-xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-pink-500 resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={addMemory}
              disabled={loading || (!caption.trim() && !selectedImage)}
              className={`
                flex-1 py-6 rounded-2xl text-2xl font-bold shadow-lg transition-all
                ${loading || (!caption.trim() && !selectedImage)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-500 hover:bg-pink-600 text-white hover:scale-105'
                }
              `}
            >
              {loading ? 'Saving...' : 'Save Memory'}
            </button>
            
            <button
              onClick={() => {
                setShowAddForm(false);
                setSelectedImage(null);
                setCaption('');
              }}
              className="px-8 py-6 rounded-2xl text-2xl font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Memories Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-8 h-8 text-pink-600" />
          <h2 className="text-4xl font-bold text-gray-800">
            Your Cherished Moments
          </h2>
        </div>

        {memories.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-lg text-center border-4 border-pink-100">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-2xl text-gray-600">
              No memories yet. Add your first memory above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border-4 border-pink-50 hover:border-pink-200 transition-all hover:shadow-2xl"
              >
                {memory.photoUrl && (
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={memory.photoUrl}
                      alt={memory.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {memory.caption && (
                    <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                      {memory.caption}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-500">
                      {formatDate(memory.timestamp)}
                    </p>
                    
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
