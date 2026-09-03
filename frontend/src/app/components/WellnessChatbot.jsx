import React, { useState } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';

const quickReplies = [
  'I feel anxious',
  'Give me a calming activity',
  'Help with memory game',
  'Remind me to log my mood',
];

const getLocalBotReply = (input) => {
  const text = input.toLowerCase();

  if (/hi|hello|hey/.test(text)) {
    return 'Hello! I am your wellness companion. How are you feeling today?';
  }

  if (/anxious|stress|panic|sad|worried|overwhelmed/.test(text)) {
    return 'Take a slow breath for 4 seconds in, 6 seconds out. Try a calming activity or a short memory game to reset your mind.';
  }

  if (/calm|relax|breathe|breathing/.test(text)) {
    return "Let's try this: inhale for 4, hold for 4, exhale for 6. Repeat 5 times and notice how your body softens.";
  }

  if (/memory|game|brain|exercise/.test(text)) {
    return 'A quick memory game can help. Try matching cards or recalling a few familiar objects from your home.';
  }

  if (/mood|emotion|feel/.test(text)) {
    return 'Logging your mood is a great step. You can use the Mood Tracker to note how you are feeling today.';
  }

  if (/reminder|medicine|task/.test(text)) {
    return 'You can set reminders for medicine or daily tasks from the Reminders page so you never miss an important moment.';
  }

  if (/photo|memory|photo memory/.test(text)) {
    return 'Your memories are important. Add a photo with a short caption to keep a joyful moment close.';
  }

  return 'I can help with calming activities, mood check-ins, memory games, and reminders. What would you like to do today?';
};

const getAIReply = async (input) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return getLocalBotReply(input);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a compassionate wellness assistant for older adults and caregivers. Offer gentle encouragement, short practical advice, and emotional support. Keep replies warm, calm, and easy to understand.',
          },
          { role: 'user', content: input },
        ],
        temperature: 0.7,
        max_tokens: 180,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI request failed');
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    return content || getLocalBotReply(input);
  } catch (error) {
    console.error('AI chatbot error:', error);
    return getLocalBotReply(input);
  }
};

export default function WellnessChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi! I am your wellness assistant. Want a calm activity, a mood check-in, or a memory game idea?',
    },
  ]);

  const handleSend = async (text) => {
    const message = text.trim();
    if (!message || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const botReply = await getAIReply(message);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-5 z-50">
      {isOpen && (
        <div className="mb-4 w-[340px] rounded-3xl border-4 border-purple-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Wellness Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-50 text-gray-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-purple-50 px-3 py-2 text-sm text-gray-600">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-gray-200 p-3">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 transition hover:bg-purple-200"
              >
                {reply}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2 border-t border-gray-200 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="rounded-full bg-purple-600 p-2 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" />
        {isOpen ? 'Close Chat' : 'Wellness Chat'}
      </button>
    </div>
  );
}
