const Memory = require('../models/Memory');

const getAllMemories = async (req, res) => {
  try {
    const memories = await Memory.find().sort({ timestamp: -1 });
    res.json({ success: true, memories });
  } catch (error) {
    console.error('Error fetching memories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const createMemory = async (req, res) => {
  try {
    const { caption, photoBase64, timestamp } = req.body;

    if (!caption && !photoBase64) {
      return res.status(400).json({ success: false, error: 'Caption or photo is required' });
    }

    const memory = await Memory.create({
      caption: caption || '',
      photoBase64: photoBase64 || null,
      timestamp: timestamp || Date.now(),
    });

    res.status(201).json({ success: true, memoryId: memory._id });
  } catch (error) {
    console.error('Error creating memory:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findByIdAndDelete(req.params.id);

    if (!memory) {
      return res.status(404).json({ success: false, error: 'Memory not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting memory:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllMemories, createMemory, deleteMemory };
