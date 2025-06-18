const express = require('express');
const mockAuth = require('../middleware/auth');
const cacheMiddleware = require('../middleware/cache');
const router = express.Router();

router.use(mockAuth);

// Mock social media data
const mockPosts = [
  { post: '#floodrelief Need food in NYC', user: 'citizen1', timestamp: new Date().toISOString() },
  { post: 'Evacuating Lower East Side! #urgent', user: 'citizen2', timestamp: new Date().toISOString() },
  { post: 'Red Cross shelter open in Manhattan', user: 'reliefAdmin', timestamp: new Date().toISOString() }
];

router.get('/:id/social-media', cacheMiddleware(req => `social-media-${req.params.id}`, 3600), async (req, res) => {
  // In a real app, filter by disaster id and keywords
  res.json(mockPosts);
});

module.exports = router; 