const express = require('express');
const { healthCheck } = require('../controllers/healthController');
const { getAllMoods, createMood } = require('../controllers/moodController');
const {
  getAllReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} = require('../controllers/reminderController');
const { getAllMemories, createMemory, deleteMemory } = require('../controllers/memoryController');

const router = express.Router();

router.get('/health', healthCheck);

router.get('/moods', getAllMoods);
router.post('/moods', createMood);

router.get('/reminders', getAllReminders);
router.post('/reminders', createReminder);
router.put('/reminders/:id', updateReminder);
router.delete('/reminders/:id', deleteReminder);

router.get('/memories', getAllMemories);
router.post('/memories', createMemory);
router.delete('/memories/:id', deleteMemory);

module.exports = router;
