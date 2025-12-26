import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Music, Wind, Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

type Page = 'home' | 'games' | 'mood' | 'reminders' | 'memories' | 'calming' | 'about';

interface CalmingActivitiesProps {
  onNavigate: (page: Page) => void;
}

export default function CalmingActivities({ onNavigate }: CalmingActivitiesProps) {
  const [activeActivity, setActiveActivity] = useState<'menu' | 'breathing' | 'music'>('menu');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  
  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Calming music tracks (using YouTube Audio Library free music)
  const tracks = [
    {
      title: 'Peaceful Piano',
      artist: 'Relaxing Sounds',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      title: 'Forest Rain',
      artist: 'Nature Sounds',
      color: 'from-green-400 to-green-600',
    },
    {
      title: 'Gentle Wind',
      artist: 'Ambient Sounds',
      color: 'from-purple-400 to-purple-600',
    },
  ];

  // Breathing exercise logic
  useEffect(() => {
    if (!isBreathing) return;

    const phases = [
      { phase: 'inhale' as const, duration: 4000, text: 'Breathe In' },
      { phase: 'hold' as const, duration: 4000, text: 'Hold' },
      { phase: 'exhale' as const, duration: 4000, text: 'Breathe Out' },
    ];

    let currentPhaseIndex = 0;
    let timeout: NodeJS.Timeout;

    const cyclePhase = () => {
      setBreathPhase(phases[currentPhaseIndex].phase);
      
      timeout = setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        if (currentPhaseIndex === 0) {
          setBreathCount((c) => c + 1);
        }
        cyclePhase();
      }, phases[currentPhaseIndex].duration);
    };

    cyclePhase();

    return () => clearTimeout(timeout);
  }, [isBreathing]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathCount(0);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathPhase('inhale');
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getBreathingText = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe Out...';
    }
  };

  const getBreathingScale = () => {
    switch (breathPhase) {
      case 'inhale':
        return 1.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1;
    }
  };

  if (activeActivity === 'menu') {
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
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mb-6 shadow-xl">
            <Wind className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Calming Activities
          </h1>
          <p className="text-2xl text-gray-600">
            Find peace and relaxation
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => setActiveActivity('breathing')}
            className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-4 border-blue-100"
          >
            <div className="text-6xl mb-6">🫁</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Guided Breathing
            </h2>
            <p className="text-xl text-gray-600">
              Follow the breathing animation to calm your mind
            </p>
          </button>

          <button
            onClick={() => setActiveActivity('music')}
            className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-4 border-purple-100"
          >
            <div className="text-6xl mb-6">🎵</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Relaxing Music
            </h2>
            <p className="text-xl text-gray-600">
              Listen to calming sounds and melodies
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (activeActivity === 'breathing') {
    return (
      <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        <button
          onClick={() => {
            setActiveActivity('menu');
            stopBreathing();
          }}
          className="mb-6 flex items-center gap-3 text-2xl text-gray-700 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-8 h-8" />
          <span className="font-semibold">Back to Activities</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Guided Breathing Exercise
          </h1>
          <p className="text-2xl text-gray-600">
            Follow the circle and breathe slowly
          </p>
        </div>

        {/* Breathing Circle */}
        <div className="flex items-center justify-center mb-12">
          <div className="relative w-96 h-96 flex items-center justify-center">
            <motion.div
              animate={{
                scale: getBreathingScale(),
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
              }}
              className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 shadow-2xl"
            />
            
            <div className="relative z-10 text-center">
              <p className="text-4xl font-bold text-white mb-4">
                {getBreathingText()}
              </p>
              {isBreathing && (
                <p className="text-2xl text-white">
                  Cycle {breathCount + 1}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Control Button */}
        <div className="text-center">
          {!isBreathing ? (
            <button
              onClick={startBreathing}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-2xl text-white px-16 py-8 rounded-3xl text-3xl font-bold shadow-lg transition-all hover:scale-105"
            >
              Start Breathing Exercise
            </button>
          ) : (
            <button
              onClick={stopBreathing}
              className="bg-gray-600 hover:bg-gray-700 text-white px-16 py-8 rounded-3xl text-3xl font-bold shadow-lg transition-all"
            >
              Stop Exercise
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="max-w-3xl mx-auto mt-12 bg-white/90 rounded-3xl p-8 shadow-lg border-4 border-blue-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            How to Practice
          </h3>
          <ul className="space-y-3 text-xl text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <span>Sit comfortably and relax your shoulders</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <span>Watch the circle grow as you breathe in through your nose</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <span>Hold your breath when the circle pauses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <span>Breathe out slowly through your mouth as the circle shrinks</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (activeActivity === 'music') {
    return (
      <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
        <button
          onClick={() => {
            setActiveActivity('menu');
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
          }}
          className="mb-6 flex items-center gap-3 text-2xl text-gray-700 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-8 h-8" />
          <span className="font-semibold">Back to Activities</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Relaxing Music
          </h1>
          <p className="text-2xl text-gray-600">
            Choose a calming sound to help you relax
          </p>
        </div>

        {/* Music Tracks */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {tracks.map((track, index) => (
            <button
              key={index}
              onClick={() => setCurrentTrack(index)}
              className={`
                rounded-3xl p-8 shadow-xl transition-all border-4
                ${currentTrack === index
                  ? `bg-gradient-to-br ${track.color} text-white border-white scale-105`
                  : 'bg-white text-gray-800 border-purple-100 hover:border-purple-300'
                }
              `}
            >
              <Music className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">{track.title}</h3>
              <p className={`text-lg ${currentTrack === index ? 'text-white/90' : 'text-gray-600'}`}>
                {track.artist}
              </p>
            </button>
          ))}
        </div>

        {/* Music Player */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-12 shadow-2xl border-4 border-purple-200">
          <div className="text-center mb-8">
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${tracks[currentTrack].color} flex items-center justify-center shadow-xl`}>
              <Music className="w-16 h-16 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              {tracks[currentTrack].title}
            </h2>
            <p className="text-2xl text-gray-600">
              {tracks[currentTrack].artist}
            </p>
          </div>

          {/* Play/Pause Button */}
          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={toggleMusic}
              className={`
                w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all
                bg-gradient-to-br ${tracks[currentTrack].color}
                hover:scale-110
              `}
            >
              {isPlaying ? (
                <Pause className="w-12 h-12 text-white" fill="white" />
              ) : (
                <Play className="w-12 h-12 text-white ml-1" fill="white" />
              )}
            </button>
          </div>

          {/* Note about audio */}
          <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-start gap-3">
              <Volume2 className="w-6 h-6 text-purple-600 mt-1" />
              <p className="text-lg text-gray-700">
                <strong>Note:</strong> This is a music player interface. In a production app, 
                you would connect this to actual audio files or streaming services. 
                For now, it demonstrates the calming music selection experience.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden audio element (placeholder) */}
        <audio ref={audioRef} loop />
      </div>
    );
  }

  return null;
}
