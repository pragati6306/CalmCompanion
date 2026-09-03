const Reminder = require('../models/Reminder');

const getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ createdAt: -1 });
    res.json({ success: true, reminders });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const createReminder = async (req, res) => {
  try {
    const { title, time, type, enabled } = req.body;

    if (!title || !time) {
      return res.status(400).json({ success: false, error: 'Title and time are required' });
    }

    const reminder = await Reminder.create({
      title,
      time,
      type: type || 'task',
      enabled: enabled !== false,
    });

    res.status(201).json({ success: true, reminderId: reminder._id });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!reminder) {
      return res.status(404).json({ success: false, error: 'Reminder not found' });
    }

    res.json({ success: true, reminder });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);

    if (!reminder) {
      return res.status(404).json({ success: false, error: 'Reminder not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllReminders,
  createReminder,
  updateReminder,
  deleteReminder,
};
