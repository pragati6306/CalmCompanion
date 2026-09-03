const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    message: 'Dementia Wellness API is running',
  });
};

module.exports = { healthCheck };
