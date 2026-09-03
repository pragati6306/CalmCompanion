const Mood = require('../models/Mood');

const getAllMoods = async (req, res) => {
  try {
    const moods = await Mood.find().sort({ timestamp: -1 });
    res.json({ success: true, moods });
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const createMood = async (req, res) => {
  try {
    const { emoji, note, timestamp } = req.body;

    if (!emoji || !timestamp) {
      return res.status(400).json({ success: false, error: 'Emoji and timestamp are required' });
    }

    const mood = await Mood.create({ emoji, note: note || '', timestamp });
    res.status(201).json({ success: true, moodId: mood._id });
  } catch (error) {
    console.error('Error creating mood:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllMoods, createMood };
