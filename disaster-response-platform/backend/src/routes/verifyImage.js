const express = require('express');
const router = express.Router();

// POST /disasters/:id/verify-image { image_url }
router.post('/:id/verify-image', async (req, res) => {
  const { image_url } = req.body;
  // In a real app, call Gemini API to verify image
  // For now, return mock verification
  const verification = {
    status: 'verified',
    details: 'Image appears authentic and contextually relevant.'
  };
  res.json(verification);
});

module.exports = router; 