import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Bell, Pill, ListTodo, Trash2, BellRing } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

type Page = 'home' | 'games' | 'mood' | 'reminders' | 'memories' | 'calming' | 'about';

interface RemindersProps {
  onNavigate: (page: Page) => void;
}

interface Reminder {
  id?: string;
  title: string;
  time: string;
  type: 'medicine' | 'task';
  enabled: boolean;
  createdAt?: number;
}

export default function Reminders({ onNavigate }: RemindersProps) {
  const [reminders, setReminders] = useState<(Reminder & { id: string })[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState<Reminder>({
    title: '',
    time: '',
    type: 'medicine',
    enabled: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReminders();
    
    // Check for reminders every minute
    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Check immediately on mount
    
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98afb243/reminders`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success && data.reminders) {
        // Transform reminders to include their keys as IDs
        const remindersWithIds = data.reminders.map((r: any) => ({
          ...r,
          id: r.id || `reminder:${r.createdAt}`
        }));
        setReminders(remindersWithIds);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const checkReminders = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    reminders.forEach(reminder => {
      if (reminder.enabled && reminder.time === currentTime) {
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Reminder Alert! 🔔', {
            body: reminder.title,
            icon: reminder.type === 'medicine' ? '💊' : '✓',
          });
        }
        
        // Also show alert
        alert(`🔔 Reminder: ${reminder.title}`);
      }
    });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        alert('Notifications enabled! You will receive reminder alerts.');
      }
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const addReminder = async () => {
    if (!newReminder.title.trim() || !newReminder.time) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98afb243/reminders`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newReminder),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setNewReminder({
          title: '',
          time: '',
          type: 'medicine',
          enabled: true,
        });
        setShowAddForm(false);
        fetchReminders();
      } else {
        alert('Failed to add reminder. Please try again.');
      }
    } catch (error) {
      console.error('Error adding reminder:', error);
      alert('Failed to add reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async (reminderId: string, currentEnabled: boolean) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98afb243/reminders/${encodeURIComponent(reminderId)}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ enabled: !currentEnabled }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        fetchReminders();
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const deleteReminder = async (reminderId: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98afb243/reminders/${encodeURIComponent(reminderId)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        fetchReminders();
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
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
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-xl">
          <Bell className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Reminders
        </h1>
        <p className="text-2xl text-gray-600">
          Never forget your medicine or tasks
        </p>
      </div>

      {/* Notification Status */}
      {'Notification' in window && Notification.permission !== 'granted' && (
        <div className="max-w-4xl mx-auto mb-8 bg-yellow-100 border-4 border-yellow-300 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <BellRing className="w-8 h-8 text-yellow-700" />
            <div className="flex-1">
              <p className="text-xl text-yellow-900 font-semibold">
                Enable notifications to receive reminder alerts
              </p>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      )}

      {/* Add Reminder Button */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:shadow-2xl text-white py-6 rounded-2xl text-2xl font-bold shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-105"
        >
          <Plus className="w-8 h-8" />
          Add New Reminder
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="max-w-4xl mx-auto mb-12 bg-white rounded-3xl p-10 shadow-xl border-4 border-green-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">New Reminder</h2>
          
          <div className="mb-6">
            <label className="block text-2xl font-semibold text-gray-800 mb-4">
              Type of Reminder
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setNewReminder({ ...newReminder, type: 'medicine' })}
                className={`
                  py-6 rounded-2xl text-xl font-bold border-4 transition-all
                  ${newReminder.type === 'medicine'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-blue-300'
                  }
                `}
              >
                <Pill className="w-8 h-8 mx-auto mb-2" />
                Medicine
              </button>
              
              <button
                onClick={() => setNewReminder({ ...newReminder, type: 'task' })}
                className={`
                  py-6 rounded-2xl text-xl font-bold border-4 transition-all
                  ${newReminder.type === 'task'
                    ? 'bg-purple-100 border-purple-500 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-purple-300'
                  }
                `}
              >
                <ListTodo className="w-8 h-8 mx-auto mb-2" />
                Task
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-2xl font-semibold text-gray-800 mb-4">
              What to remember
            </label>
            <input
              type="text"
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              placeholder="e.g., Take blood pressure medicine"
              className="w-full px-6 py-4 text-xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="mb-8">
            <label className="block text-2xl font-semibold text-gray-800 mb-4">
              Time
            </label>
            <input
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              className="w-full px-6 py-4 text-xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={addReminder}
              disabled={loading}
              className={`
                flex-1 py-6 rounded-2xl text-2xl font-bold shadow-lg transition-all
                ${loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                }
              `}
            >
              {loading ? 'Saving...' : 'Save Reminder'}
            </button>
            
            <button
              onClick={() => setShowAddForm(false)}
              className="px-8 py-6 rounded-2xl text-2xl font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Your Reminders</h2>

        {reminders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-lg text-center border-4 border-green-100">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-2xl text-gray-600">
              No reminders yet. Add your first reminder above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`
                  bg-white rounded-2xl p-6 shadow-lg border-4 transition-all
                  ${reminder.enabled 
                    ? 'border-green-200 hover:border-green-300' 
                    : 'border-gray-200 opacity-60'
                  }
                `}
              >
                <div className="flex items-center gap-6">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                    ${reminder.type === 'medicine' 
                      ? 'bg-blue-100' 
                      : 'bg-purple-100'
                    }
                  `}>
                    {reminder.type === 'medicine' ? '💊' : '✓'}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                      {reminder.title}
                    </h3>
                    <p className="text-xl text-gray-600">
                      {new Date(`2000-01-01T${reminder.time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleReminder(reminder.id, reminder.enabled)}
                    className={`
                      px-6 py-3 rounded-xl font-bold text-lg transition-colors
                      ${reminder.enabled
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                      }
                    `}
                  >
                    {reminder.enabled ? 'ON' : 'OFF'}
                  </button>

                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
