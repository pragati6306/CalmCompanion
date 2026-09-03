import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Bell, Pill, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api.js';

export default function Reminders({ onNavigate }) {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    time: '',
    type: 'medicine',
    enabled: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(checkReminders, 60000);
    checkReminders();
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders`);
      const data = await response.json();
      if (data.success && data.reminders) {
        const remindersWithIds = data.reminders.map((r) => ({
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
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Reminder Alert! 🔔', {
            body: reminder.title,
            icon: reminder.type === 'medicine' ? '💊' : '✓',
          });
        }
        alert(`🔔 Reminder: ${reminder.title}`);
      }
    });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        alert('Notifications enabled!');
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
      const response = await fetch(`${API_BASE_URL}/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReminder),
      });

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
        alert('Failed to add reminder.');
      }
    } catch (error) {
      console.error('Error adding reminder:', error);
      alert('Failed to add reminder.');
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async (reminderId, currentEnabled) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${encodeURIComponent(reminderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !currentEnabled }),
      });

      const data = await response.json();
      
      if (data.success) {
        fetchReminders();
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const deleteReminder = async (reminderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${encodeURIComponent(reminderId)}`, {
        method: 'DELETE',
      });

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
          Set reminders for medicines and tasks
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-8 bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-4 rounded-3xl text-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Add Reminder
        </button>

        {showAddForm && (
          <div className="bg-white rounded-3xl p-10 shadow-xl border-4 border-green-100 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              New Reminder
            </h2>

            <div className="mb-6">
              <label className="block text-2xl font-semibold text-gray-800 mb-3">
                Title
              </label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                placeholder="e.g., Take medicine"
                className="w-full px-6 py-4 text-xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-2xl font-semibold text-gray-800 mb-3">
                Time
              </label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="w-full px-6 py-4 text-xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-2xl font-semibold text-gray-800 mb-3">
                Type
              </label>
              <select
                value={newReminder.type}
                onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                className="w-full px-6 py-4 text-xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
              >
                <option value="medicine">Medicine</option>
                <option value="task">Task</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={addReminder}
                disabled={loading}
                className="flex-1 bg-green-500 text-white px-6 py-4 rounded-2xl text-2xl font-bold hover:bg-green-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
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

        <div className="space-y-4">
          {reminders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 shadow-lg text-center border-4 border-green-100">
              <p className="text-2xl text-gray-600">No reminders yet. Add one above!</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="bg-white rounded-2xl p-6 shadow-lg border-4 border-green-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  {reminder.type === 'medicine' ? (
                    <Pill className="w-8 h-8 text-green-600" />
                  ) : (
                    <Bell className="w-8 h-8 text-green-600" />
                  )}
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{reminder.title}</p>
                    <p className="text-xl text-gray-600">{reminder.time}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleReminder(reminder.id, reminder.enabled)}
                    className={`px-6 py-3 rounded-2xl font-bold text-lg ${
                      reminder.enabled
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {reminder.enabled ? 'On' : 'Off'}
                  </button>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="bg-red-200 text-red-800 px-4 py-3 rounded-2xl hover:bg-red-300 transition-all"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
