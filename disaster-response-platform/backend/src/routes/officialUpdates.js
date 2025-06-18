const express = require('express');
const router = express.Router();
const cacheMiddleware = require('../middleware/cache');

// GET /disasters/:id/official-updates
router.get('/:id/official-updates', cacheMiddleware(req => `official-updates-${req.params.id}`, 3600), async (req, res) => {
  // In a real app, fetch and parse updates from FEMA/Red Cross
  // For now, return mock data
  const updates = [
    { source: 'FEMA', update: 'Flood warning in effect for Manhattan.', timestamp: new Date().toISOString() },
    { source: 'Red Cross', update: 'Shelter open at Lower East Side.', timestamp: new Date().toISOString() }
  ];
  res.json(updates);
});

module.exports = router; 