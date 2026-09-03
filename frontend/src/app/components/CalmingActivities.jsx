import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wind } from 'lucide-react';

export default function CalmingActivities({ onNavigate }) {
  const [activeActivity, setActiveActivity] = useState('menu');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(0);

  useEffect(() => {
    if (!isBreathing) return;

    const phases = [
      { phase: 'inhale', duration: 4000, text: 'Breathe In' },
      { phase: 'hold', duration: 4000, text: 'Hold' },
      { phase: 'exhale', duration: 4000, text: 'Breathe Out' },
    ];

    let currentPhaseIndex = 0;
    let timeout;

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

  const getBreathingText = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe Out...';
      default:
        return 'Ready?';
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
      default:
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

        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setActiveActivity('breathing')}
            className="w-full bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-4 border-blue-100 mb-6"
          >
            <div className="text-6xl mb-4">🫁</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Guided Breathing
            </h2>
            <p className="text-xl text-gray-600">
              Follow the breathing animation to calm your mind
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
            <div
              className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 shadow-2xl transition-transform duration-1000"
              style={{
                transform: `scale(${getBreathingScale()})`
              }}
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

  return null;
}
